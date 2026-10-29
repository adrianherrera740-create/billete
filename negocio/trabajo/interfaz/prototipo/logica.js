/* Logica pura de la interfaz (sin DOM, sin red, sin almacenamiento). Probada en tests/logica.test.js.
   Reglas: la IA propone, el humano decide; nada se envia; el aviso de bloqueo no lleva contenido. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Logica = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CADUCIDAD_DECISION_LOCAL_MS = 12 * 3600 * 1000; // propuesta de diseno, no verificada
  const PALABRAS_POR_SEGUNDO = 3.5;                      // ~210 palabras/min, supuesto de lectura
  const TIPOS_EXTERNOS = ['borrador'];                   // efecto externo: exigen segundo paso

  // 1. Aviso de pantalla de bloqueo: SOLO un recuento. Por construccion no recibe contenido.
  function avisoBloqueo(pendientes) {
    const n = Array.isArray(pendientes) ? pendientes.length : Number(pendientes) || 0;
    if (n <= 0) return null;
    return { titulo: 'Pendiente', texto: n === 1 ? 'Tienes 1 asunto pendiente.' : 'Tienes ' + n + ' asuntos pendientes.' };
  }

  // 2. Texto inerte: ninguna URL activa ni imagen (mismo criterio que el filtro de salida del MVP).
  function inerte(s) {
    return String(s == null ? '' : s)
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/https?:\/\//gi, function (m) { return m.toLowerCase().replace('t', 'x').replace('t', 'x'); })
      .replace(/[<>]/g, '');
  }

  // 3. Briefing de 60 segundos: maximo 3 decisiones, 4 citas, una linea de "sin tocar".
  const ORDEN = { Riesgo: 0, Responder: 1, Importante: 2 };
  function compilarBriefing(datos) {
    const c = { total: datos.correos.length, Riesgo: 0, Responder: 0, Importante: 0, Informativo: 0, Sospechoso: 0, Excluido: 0, Revisar: 0 };
    datos.correos.forEach(function (m) { if (m.etiqueta in c) c[m.etiqueta]++; else c.Revisar++; });
    const candidatos = datos.correos.filter(function (m) { return m.etiqueta in ORDEN; })
      .sort(function (a, b) {
        const p = { alta: 0, media: 1, baja: 2 };
        return ORDEN[a.etiqueta] - ORDEN[b.etiqueta] || p[a.prioridad] - p[b.prioridad];
      });
    const decide = candidatos.slice(0, 3).map(function (m) { return { id: m.id, etiqueta: m.etiqueta, texto: inerte(m.resumen) }; });
    const mas = Math.max(0, candidatos.length - decide.length);
    const agenda = datos.agenda.slice(0, 4).map(function (e) {
      return { hora: e.hora, texto: inerte(e.titulo) + (e.verificado ? '' : ' (organizador no verificado)') };
    });
    const sinTocar = c.Informativo + ' informativos' +
      '; ' + c.Sospechoso + ' para revisar con cuidado (no se resumen)' +
      '; ' + c.Excluido + ' excluidos por regla (la IA no los leyo).';
    const estado = c.total + ' correos revisados. Nada enviado: tu decides.';
    const cabecera = [estado, sinTocar, mas ? 'y ' + mas + ' mas en Aprobaciones' : ''];
    const palabras = cabecera.concat(
      decide.map(function (d) { return d.etiqueta + ' ' + d.texto; }),
      agenda.map(function (a) { return a.hora + ' ' + a.texto; })
    ).join(' ').split(/\s+/).filter(Boolean).length;
    return { contadores: c, estado: estado, decide: decide, mas: mas, agenda: agenda, sinTocar: sinTocar,
             palabras: palabras, segundosLectura: Math.ceil(palabras / PALABRAS_POR_SEGUNDO) };
  }

  // 4. Cola de aprobaciones con roles, segundo paso, fuera de linea y apagado.
  function crearCola(items) {
    return items.map(function (i) { return Object.assign({}, i, { estado: 'pendiente', decisionLocal: null, aviso: '' }); });
  }

  function permisos(rol, item, verbo, delegacion) {
    if (rol === 'titular') return true;
    if (rol !== 'asistente') return false;
    if (verbo === 'RECHAZAR' || verbo === 'POSPONER') return true;
    if (verbo === 'APROBAR') {
      if (item.soloTitular || item.contieneImportes) return false;
      return Array.isArray(delegacion) && delegacion.indexOf(item.tipo) !== -1;
    }
    return false;
  }

  function decidir(cola, id, verbo, ctx) {
    const copia = cola.map(function (i) { return Object.assign({}, i); });
    const item = copia.find(function (i) { return i.id === id; });
    const fallo = function (motivo) { return { cola: copia, ok: false, motivo: motivo }; };
    if (ctx.apagado) return fallo('apagado');
    if (['APROBAR', 'RECHAZAR', 'POSPONER'].indexOf(verbo) === -1) return fallo('verbo_invalido');
    if (!item) return fallo('no_existe');
    if (item.estado !== 'pendiente') return fallo('ya_decidido');
    if (!permisos(ctx.rol, item, verbo, ctx.delegacion)) return fallo('sin_permiso');
    if (!ctx.enLinea) {
      // Sin conexion: solo se guarda la intencion (id + verbo + hora). No cambia el estado.
      item.decisionLocal = { verbo: verbo, ts: ctx.ahora };
      return { cola: copia, ok: true, motivo: 'guardada_local' };
    }
    if (verbo === 'APROBAR' && TIPOS_EXTERNOS.indexOf(item.tipo) !== -1 && ctx.segundoPaso !== true) return fallo('falta_segundo_paso');
    item.estado = { APROBAR: 'aprobado', RECHAZAR: 'rechazado', POSPONER: 'pospuesto' }[verbo];
    item.decisionLocal = null;
    return { cola: copia, ok: true, motivo: 'aplicada' };
  }

  function sincronizar(cola, ctx) {
    const copia = cola.map(function (i) { return Object.assign({}, i); });
    if (ctx.apagado || !ctx.enLinea) return copia;
    copia.forEach(function (i) {
      if (!i.decisionLocal || i.estado !== 'pendiente') return;
      const d = i.decisionLocal;
      if (ctx.ahora - d.ts > CADUCIDAD_DECISION_LOCAL_MS) {
        i.decisionLocal = null; i.aviso = 'La decision guardada sin conexion caduco: revisa de nuevo.'; return;
      }
      if (d.verbo === 'APROBAR') {
        if (TIPOS_EXTERNOS.indexOf(i.tipo) !== -1 && ctx.segundoPaso !== true) {
          i.aviso = 'Confirma la aprobacion con tu segundo paso.'; return; // sigue pendiente
        }
        i.estado = 'aprobado';
      } else i.estado = d.verbo === 'RECHAZAR' ? 'rechazado' : 'pospuesto';
      i.decisionLocal = null;
    });
    return copia;
  }

  // 5. Apagado: un gesto, sin pedir credenciales. Reanudar si exige passkey.
  function apagar(estado) {
    return { apagado: true, cache: null,
      cola: estado.cola.map(function (i) { return Object.assign({}, i, { estado: i.estado === 'pendiente' ? 'cancelado' : i.estado, decisionLocal: null }); }) };
  }
  function reanudar(estado, ctx) {
    if (!ctx || ctx.passkeyOk !== true) return { estado: estado, ok: false, motivo: 'falta_passkey' };
    return { estado: Object.assign({}, estado, { apagado: false }), ok: true, motivo: 'reanudado' };
  }

  // 6. Guion de voz. Sin modo privado solo lee recuentos y horas, nunca titulos ni nombres.
  function guionVoz(b, privado) {
    const c = b.contadores;
    const partes = ['Buenos dias. ' + c.total + ' correos revisados. Nada se ha enviado.'];
    if (c.Riesgo) partes.push(c.Riesgo + ' de riesgo: verificalos antes de actuar.');
    partes.push(c.Responder + ' para responder, ' + c.Importante + ' importantes.');
    if (c.Sospechoso) partes.push(c.Sospechoso + ' para revisar con cuidado en pantalla.');
    partes.push(b.agenda.length + ' citas hoy.');
    b.agenda.forEach(function (a) { partes.push('A las ' + a.hora + (privado ? ': ' + a.texto : '.')); });
    if (privado) b.decide.forEach(function (d) { partes.push(d.etiqueta + ': ' + d.texto); });
    partes.push('Para decidir, abre el panel.');
    return partes.join(' ');
  }

  return { avisoBloqueo: avisoBloqueo, inerte: inerte, compilarBriefing: compilarBriefing, crearCola: crearCola,
           decidir: decidir, sincronizar: sincronizar, apagar: apagar, reanudar: reanudar, guionVoz: guionVoz,
           CADUCIDAD_DECISION_LOCAL_MS: CADUCIDAD_DECISION_LOCAL_MS };
});
