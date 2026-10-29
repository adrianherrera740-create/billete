'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const L = require('../logica.js');
const D = require('../datos.js');

const base = { rol: 'titular', apagado: false, enLinea: true, segundoPaso: true, ahora: 1000, delegacion: [] };

test('aviso de bloqueo: solo recuento, nunca contenido', () => {
  const sensibles = [{ id: 'A-1', asunto: 'Cambio de IBAN ES00', de: 'Marta', importe: '8.400 EUR' }];
  const a = L.avisoBloqueo(sensibles);
  assert.equal(a.texto, 'Tienes 1 asunto pendiente.');
  const todo = JSON.stringify(a);
  for (const s of ['IBAN', 'Marta', '8.400', 'A-1', 'ES00']) assert.ok(!todo.includes(s), s);
  assert.equal(L.avisoBloqueo([]), null);
  assert.equal(L.avisoBloqueo(4).texto, 'Tienes 4 asuntos pendientes.');
});

test('texto inerte: sin imagen markdown, sin html, enlaces neutralizados', () => {
  const s = L.inerte('hola ![](https://atacante.test/p?d=1) <b>x</b> http://a.test');
  assert.ok(!s.includes('!['));
  assert.ok(!/<|>/.test(s));
  assert.ok(!/https?:/i.test(s));
  assert.ok(s.includes('hxxp://a.test'));
});

test('briefing: se lee en 60 s o menos y cada correo se cuenta una vez', () => {
  const b = L.compilarBriefing(D);
  assert.ok(b.segundosLectura <= 60, 'segundos ' + b.segundosLectura);
  const c = b.contadores;
  const suma = c.Riesgo + c.Responder + c.Importante + c.Informativo + c.Sospechoso + c.Excluido + c.Revisar;
  assert.equal(suma, c.total);
  assert.ok(b.decide.length <= 3);
  assert.ok(b.agenda.length <= 4);
});

test('briefing: el riesgo va primero; sospechosos y excluidos no se resumen', () => {
  const b = L.compilarBriefing(D);
  assert.equal(b.decide[0].etiqueta, 'Riesgo');
  const ids = b.decide.map((d) => d.id);
  for (const x of ['e003', 'e004', 'e009', 'e006']) assert.ok(!ids.includes(x));
  assert.ok(b.agenda.some((a) => a.texto.includes('no verificado')));
});

test('briefing: con mas de tres decisiones lo dice, no oculta', () => {
  const b = L.compilarBriefing(D);
  assert.equal(b.decide.length + b.mas, 5); // 1 riesgo + 3 responder + 1 importante
  assert.ok(b.mas > 0);
});

test('aprobar un borrador exige segundo paso; sin el no cambia nada', () => {
  const cola = L.crearCola(D.cola);
  const r = L.decidir(cola, 'A-0001', 'APROBAR', Object.assign({}, base, { segundoPaso: false }));
  assert.equal(r.ok, false);
  assert.equal(r.motivo, 'falta_segundo_paso');
  assert.equal(r.cola[0].estado, 'pendiente');
  const ok = L.decidir(cola, 'A-0001', 'APROBAR', base);
  assert.equal(ok.cola[0].estado, 'aprobado');
});

test('una decision no se repite', () => {
  let cola = L.crearCola(D.cola);
  cola = L.decidir(cola, 'A-0001', 'RECHAZAR', base).cola;
  assert.equal(L.decidir(cola, 'A-0001', 'APROBAR', base).motivo, 'ya_decidido');
});

test('la cola original no se modifica (inmutabilidad)', () => {
  const cola = L.crearCola(D.cola);
  L.decidir(cola, 'A-0001', 'RECHAZAR', base);
  assert.equal(cola[0].estado, 'pendiente');
});

test('modo asistente: puede rechazar y posponer, no aprobar sin delegacion', () => {
  const cola = L.crearCola(D.cola);
  const ea = Object.assign({}, base, { rol: 'asistente' });
  assert.equal(L.decidir(cola, 'A-0001', 'APROBAR', ea).motivo, 'sin_permiso');
  assert.equal(L.decidir(cola, 'A-0001', 'RECHAZAR', ea).ok, true);
  assert.equal(L.decidir(cola, 'A-0001', 'POSPONER', ea).ok, true);
});

test('modo asistente: con delegacion aprueba su tipo, nunca importes ni solo-titular', () => {
  const cola = L.crearCola(D.cola.concat([
    { id: 'A-0009', tipo: 'borrador', ref: 'D-9', contieneImportes: true, soloTitular: false, texto: '' },
    { id: 'A-0010', tipo: 'borrador', ref: 'D-10', contieneImportes: false, soloTitular: true, texto: '' }]));
  const ea = Object.assign({}, base, { rol: 'asistente', delegacion: ['crm_alta'] });
  assert.equal(L.decidir(cola, 'A-0004', 'APROBAR', ea).ok, true);
  assert.equal(L.decidir(cola, 'A-0001', 'APROBAR', ea).motivo, 'sin_permiso'); // borrador no delegado
  const ea2 = Object.assign({}, ea, { delegacion: ['borrador'] });
  assert.equal(L.decidir(cola, 'A-0001', 'APROBAR', ea2).ok, true);
  assert.equal(L.decidir(cola, 'A-0009', 'APROBAR', ea2).motivo, 'sin_permiso');
  assert.equal(L.decidir(cola, 'A-0010', 'APROBAR', ea2).motivo, 'sin_permiso');
});

test('rol desconocido no puede nada', () => {
  const cola = L.crearCola(D.cola);
  assert.equal(L.decidir(cola, 'A-0001', 'RECHAZAR', Object.assign({}, base, { rol: 'operador' })).motivo, 'sin_permiso');
});

test('verbo y id invalidos se rechazan', () => {
  const cola = L.crearCola(D.cola);
  assert.equal(L.decidir(cola, 'A-0001', 'ENVIAR', base).motivo, 'verbo_invalido');
  assert.equal(L.decidir(cola, 'A-9999', 'APROBAR', base).motivo, 'no_existe');
});

test('sin conexion: se guarda la intencion y el estado NO cambia', () => {
  const cola = L.crearCola(D.cola);
  const r = L.decidir(cola, 'A-0001', 'APROBAR', Object.assign({}, base, { enLinea: false }));
  assert.equal(r.motivo, 'guardada_local');
  assert.equal(r.cola[0].estado, 'pendiente');
  assert.equal(r.cola[0].decisionLocal.verbo, 'APROBAR');
});

test('al volver la conexion: rechazar se aplica; aprobar borrador pide segundo paso', () => {
  let cola = L.crearCola(D.cola);
  const off = Object.assign({}, base, { enLinea: false, ahora: 1000 });
  cola = L.decidir(cola, 'A-0001', 'APROBAR', off).cola;
  cola = L.decidir(cola, 'A-0002', 'RECHAZAR', off).cola;
  let s = L.sincronizar(cola, Object.assign({}, base, { segundoPaso: false, ahora: 2000 }));
  assert.equal(s[0].estado, 'pendiente');
  assert.ok(s[0].aviso.length > 0);
  assert.equal(s[1].estado, 'rechazado');
  s = L.sincronizar(s, Object.assign({}, base, { segundoPaso: true, ahora: 3000 }));
  assert.equal(s[0].estado, 'aprobado');
});

test('una decision guardada sin conexion caduca', () => {
  let cola = L.crearCola(D.cola);
  cola = L.decidir(cola, 'A-0001', 'APROBAR', Object.assign({}, base, { enLinea: false, ahora: 0 })).cola;
  const s = L.sincronizar(cola, Object.assign({}, base, { ahora: L.CADUCIDAD_DECISION_LOCAL_MS + 1 }));
  assert.equal(s[0].estado, 'pendiente');
  assert.equal(s[0].decisionLocal, null);
  assert.ok(s[0].aviso.includes('caduc'));
});

test('apagado: cancela pendientes, borra cache, bloquea decisiones y sincronizacion', () => {
  const cola = L.crearCola(D.cola);
  const est = L.apagar({ cola: cola });
  assert.equal(est.apagado, true);
  assert.equal(est.cache, null);
  assert.ok(est.cola.every((i) => i.estado === 'cancelado'));
  assert.equal(L.decidir(cola, 'A-0001', 'RECHAZAR', Object.assign({}, base, { apagado: true })).motivo, 'apagado');
});

test('reanudar exige passkey', () => {
  const est = L.apagar({ cola: [] });
  assert.equal(L.reanudar(est, {}).ok, false);
  assert.equal(L.reanudar(est, { passkeyOk: true }).estado.apagado, false);
});

test('voz: dura menos de 2 min y, sin modo privado, no lee titulos ni nombres', () => {
  const b = L.compilarBriefing(D);
  const pub = L.guionVoz(b, false);
  const priv = L.guionVoz(b, true);
  assert.ok(pub.split(/\s+/).length <= 280);
  assert.ok(priv.split(/\s+/).length <= 280);
  for (const s of ['asesora', 'cuenta bancaria', 'Llamada']) assert.ok(!pub.includes(s), s);
  assert.ok(priv.includes('asesora'));
});

// Vigilancia del codigo: sin red, sin envio, sin secretos, datos ficticios.
const ficheros = ['logica.js', 'app.js', 'datos.js', 'index.html'].map((f) => [f, fs.readFileSync(path.join(__dirname, '..', f), 'utf8')]);

test('sin red ni envio en el codigo', () => {
  for (const [f, src] of ficheros) {
    for (const prohibido of [/\bfetch\s*\(/, /XMLHttpRequest/, /WebSocket/, /sendBeacon/, /navigator\.share/, /<img\b/i, /<iframe\b/i, /\beval\s*\(/, /innerHTML/]) {
      assert.ok(!prohibido.test(src), f + ' contiene ' + prohibido);
    }
    assert.ok(!/src="https?:|href="https?:/i.test(src), f + ' carga recursos externos');
  }
});

test('sin secretos ni datos reales', () => {
  for (const [f, src] of ficheros) {
    assert.ok(!/(api[_-]?key|secret|token|password|passwd)\s*[:=]\s*['"][^'"]+/i.test(src), f);
    const correos = src.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g) || [];
    for (const c of correos) assert.ok(/\.(example|test)$/.test(c), f + ' correo no reservado: ' + c);
  }
});
