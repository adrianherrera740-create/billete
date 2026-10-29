/* Datos FICTICIOS (dominios reservados .example). Reflejan la salida de la demo del MVP.
   No añadir datos reales (condicion 4). Sin red. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DATOS = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  return {
    fecha: '03/11/2026',
    aviso: 'Fase de prueba: datos ficticios; no apto para datos reales hasta cerrar el kit legal.',
    correos: [
      { id: 'e005', etiqueta: 'Riesgo', prioridad: 'alta', resumen: 'Un proveedor pide cambiar la cuenta bancaria. Verifica por un canal que ya conocias.' },
      { id: 'e001', etiqueta: 'Responder', prioridad: 'media', resumen: 'La asesora fiscal pide confirmar disponibilidad para revisar una escritura.' },
      { id: 'e008', etiqueta: 'Responder', prioridad: 'media', resumen: 'Un familiar propone cena el sabado.' },
      { id: 'e010', etiqueta: 'Responder', prioridad: 'media', resumen: 'Contacto nuevo propone una llamada.' },
      { id: 'e002', etiqueta: 'Importante', prioridad: 'media', resumen: 'Aviso de vencimiento de un deposito el 15/11.' },
      { id: 'e007', etiqueta: 'Informativo', prioridad: 'baja', resumen: 'Boletin semanal.' },
      { id: 'e003', etiqueta: 'Sospechoso', prioridad: 'media', resumen: '' },
      { id: 'e004', etiqueta: 'Sospechoso', prioridad: 'media', resumen: '' },
      { id: 'e009', etiqueta: 'Sospechoso', prioridad: 'media', resumen: '' },
      { id: 'e006', etiqueta: 'Excluido', prioridad: 'baja', resumen: '' }
    ],
    agenda: [
      { hora: '12:30', titulo: 'Comida con la asesora fiscal', verificado: true },
      { hora: '17:00', titulo: 'Llamada de presentacion', verificado: false }
    ],
    cola: [
      { id: 'A-0001', tipo: 'borrador', ref: 'D-001', contieneImportes: false, soloTitular: false, texto: 'Hola, confirmo que estoy disponible el jueves por la tarde. Te propongo las 17:00.' },
      { id: 'A-0002', tipo: 'borrador', ref: 'D-002', contieneImportes: false, soloTitular: false, texto: 'Perfecto, nos vemos el sabado. Dime hora y sitio.' },
      { id: 'A-0003', tipo: 'borrador', ref: 'D-003', contieneImportes: false, soloTitular: false, texto: 'Recibido, lo reviso y te respondo.' },
      { id: 'A-0004', tipo: 'crm_alta', ref: 'e010', contieneImportes: false, soloTitular: false, texto: 'Alta propuesta en la agenda de contactos: contacto nuevo (ficticio).' }
    ]
  };
});
