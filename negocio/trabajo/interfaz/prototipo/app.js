/* Interfaz del prototipo. Solo DOM + logica.js. Sin red, sin almacenamiento, sin credenciales.
   Todo texto se inserta con textContent. */
(function () {
  'use strict';
  var L = window.Logica, D = window.DATOS;
  var estado = { rol: 'titular', enLinea: true, apagado: false, segundoPaso: false, cola: L.crearCola(D.cola), vista: 'hoy', delegacion: [] };
  var $ = function (id) { return document.getElementById(id); };
  var MENSAJES = { falta_segundo_paso: 'Falta el segundo paso (huella o passkey).', sin_permiso: 'Tu rol no puede hacer esto: pasa el asunto al titular.',
    ya_decidido: 'Ya estaba decidido.', apagado: 'Todo esta apagado.', guardada_local: 'Sin conexion: decision guardada; se confirmara al volver.', aplicada: 'Hecho. Nada se ha enviado: queda listo para que lo envies tu.' };

  function el(tag, texto, clase) { var e = document.createElement(tag); if (texto != null) e.textContent = texto; if (clase) e.className = clase; return e; }
  function vaciar(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function aviso(msg) { $('estado').textContent = msg; }

  function pintarHoy(c) {
    var b = L.compilarBriefing(D);
    c.appendChild(el('h2', 'Hoy ' + D.fecha));
    c.appendChild(el('p', b.estado, 'estado'));
    c.appendChild(el('p', 'Lectura estimada: ' + b.segundosLectura + ' s', 'nota'));
    c.appendChild(el('h3', 'Necesita tu decision'));
    var ul = el('ul'); b.decide.forEach(function (d) { ul.appendChild(el('li', d.etiqueta + '. ' + d.texto)); }); c.appendChild(ul);
    if (b.mas) c.appendChild(el('p', 'y ' + b.mas + ' mas en Aprobaciones', 'nota'));
    c.appendChild(el('h3', 'Agenda'));
    var ag = el('ul'); b.agenda.forEach(function (a) { ag.appendChild(el('li', a.hora + '  ' + a.texto)); }); c.appendChild(ag);
    c.appendChild(el('h3', 'Sin tocar'));
    c.appendChild(el('p', b.sinTocar));
    c.appendChild(el('p', D.aviso, 'nota'));
  }

  function pintarCola(c) {
    c.appendChild(el('h2', 'Aprobaciones'));
    var pend = estado.cola.filter(function (i) { return i.estado === 'pendiente'; });
    if (!pend.length) c.appendChild(el('p', 'Nada pendiente.', 'estado'));
    estado.cola.forEach(function (i) {
      var t = el('section', null, 'tarjeta'); t.setAttribute('aria-label', 'Asunto ' + i.id);
      t.appendChild(el('h3', i.id + '  ' + (i.tipo === 'borrador' ? 'Borrador de respuesta' : 'Alta en agenda de contactos') + '  [' + i.estado + ']'));
      t.appendChild(el('p', L.inerte(i.texto), 'cuerpo'));
      if (i.contieneImportes) t.appendChild(el('p', 'Contiene importes o cuentas: solo el titular.', 'aviso'));
      if (i.decisionLocal) t.appendChild(el('p', 'Guardada sin conexion: ' + i.decisionLocal.verbo, 'aviso'));
      if (i.aviso) t.appendChild(el('p', i.aviso, 'aviso'));
      if (i.estado === 'pendiente') {
        var fila = el('div', null, 'fila');
        [['APROBAR', 'Aprobar', 'ok'], ['RECHAZAR', 'Rechazar', 'no'], ['POSPONER', 'Mas tarde', 'neutro']].forEach(function (v) {
          var b = el('button', v[1], v[2]); b.type = 'button';
          b.addEventListener('click', function () { actuar(i.id, v[0]); }); fila.appendChild(b);
        });
        t.appendChild(fila);
      }
      c.appendChild(t);
    });
  }

  function actuar(id, verbo) {
    var r = L.decidir(estado.cola, id, verbo, { rol: estado.rol, apagado: estado.apagado, enLinea: estado.enLinea, segundoPaso: estado.segundoPaso, ahora: Date.now(), delegacion: estado.delegacion });
    estado.cola = r.cola; aviso(MENSAJES[r.motivo] || r.motivo); pintar();
  }

  function pintarBloqueo(c) {
    c.appendChild(el('h2', 'Asi se ve la pantalla de bloqueo'));
    var pend = estado.cola.filter(function (i) { return i.estado === 'pendiente'; });
    var a = estado.apagado ? null : L.avisoBloqueo(pend);
    var tel = el('div', null, 'telefono'); tel.appendChild(el('p', '07:00', 'hora'));
    if (a) { var n = el('div', null, 'notif'); n.appendChild(el('strong', a.titulo)); n.appendChild(el('p', a.texto)); tel.appendChild(n); }
    else tel.appendChild(el('p', 'Sin notificaciones.', 'nota'));
    c.appendChild(tel);
    c.appendChild(el('p', 'Nunca en el bloqueo: nombres, asuntos, importes, cuentas, titulos de reuniones, resumenes ni vista previa de ningun tipo.', 'nota'));
  }

  function pintarAjustes(c) {
    c.appendChild(el('h2', 'Ajustes y apagado'));
    var ap = el('button', estado.apagado ? 'Todo apagado. Reanudar (pide passkey)' : 'APAGAR TODO', 'peligro'); ap.type = 'button';
    ap.addEventListener('click', function () {
      if (!estado.apagado) { var e = L.apagar({ cola: estado.cola }); estado.cola = e.cola; estado.apagado = true; aviso('Apagado. Cola cancelada y cache borrada. Para reanudar hace falta tu passkey.'); }
      else { var r = L.reanudar({ apagado: true }, { passkeyOk: estado.segundoPaso }); if (r.ok) { estado.apagado = false; estado.cola = L.crearCola(D.cola); aviso('Reanudado.'); } else aviso('Activa "segundo paso" para simular la passkey.'); }
      pintar();
    });
    c.appendChild(ap);
    c.appendChild(el('p', 'Independiente de esto, puedes revocar el acceso desde tu cuenta de correo. Aqui solo se simula.', 'nota'));
  }

  function pintar() {
    var c = $('contenido'); vaciar(c);
    ({ hoy: pintarHoy, cola: pintarCola, bloqueo: pintarBloqueo, ajustes: pintarAjustes })[estado.vista](c);
    $('pend').textContent = estado.cola.filter(function (i) { return i.estado === 'pendiente'; }).length;
  }

  document.querySelectorAll('nav button').forEach(function (b) { b.addEventListener('click', function () { estado.vista = b.dataset.vista; aviso(''); pintar(); }); });
  $('rol').addEventListener('change', function (e) { estado.rol = e.target.value; estado.delegacion = []; aviso('Modo: ' + (estado.rol === 'titular' ? 'titular' : 'asistente (prepara; no aprueba sin delegacion)')); });
  $('linea').addEventListener('change', function (e) {
    estado.enLinea = e.target.checked;
    if (estado.enLinea) { estado.cola = L.sincronizar(estado.cola, { apagado: estado.apagado, enLinea: true, segundoPaso: estado.segundoPaso, ahora: Date.now() }); aviso('Conexion recuperada.'); }
    else aviso('Sin conexion: solo lectura del ultimo briefing; las decisiones se guardan.');
    pintar();
  });
  $('paso2').addEventListener('change', function (e) { estado.segundoPaso = e.target.checked; });
  document.addEventListener('visibilitychange', function () { $('contenido').hidden = document.hidden; }); // privacidad en el selector de apps
  pintar();
})();
