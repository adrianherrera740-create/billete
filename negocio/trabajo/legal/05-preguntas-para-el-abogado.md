# Preguntas para el abogado de protección de datos

> **Borrador sin revisar por abogado.** No es asesoramiento jurídico. Lista preparada con IA (No verificado, condición 8) a partir de `negocio/trabajo/seguridad/analisis-riesgos.md` y `cerebro/negocio/resumen.md`. Llevar junto a los documentos 01 a 04 de esta carpeta. Firmar o reunirse con el abogado es cosa de la persona (condición 12). Sin datos personales.

## Qué llevar
Los cuatro borradores; el análisis de riesgos; la arquitectura (Google Workspace / Microsoft 365 del cliente, n8n en la UE, LLM con residencia UE, aprobación humana, registro auditable); el perfil de cliente (patrimonios altos, buzones con datos de terceros y posible categoría especial).

## A. Roles y encaje
1. ¿Soy encargado, corresponsable o responsable en cada tratamiento (briefing, triaje, dossier, CRM, registro)? El CRM crea fichas de contactos del cliente: ¿cambia el rol?
2. ¿Qué pasa con los datos de terceros que nunca han interactuado con el cliente? ¿Hay que limitar el CRM?
3. Si algún día uso datos anonimizados o agregados para mejorar el producto, ¿qué exige la ley y es compatible con el rol de encargado?

## B. Contrato de encargado (documento 02)
4. ¿La lista de contenidos del art. 28.3 que usé (de memoria, letras a–h) es completa y está bien ordenada? Contrastar con el texto literal. [NV]
5. ¿Conviene basarse en las cláusulas tipo de la Comisión (Decisión de ejecución 2021/915) en vez de mi redacción? ¿Con qué adaptaciones?
6. Subencargados: ¿autorización previa específica o general? ¿Plazo de aviso y derecho de oposición razonables?
7. Plazo de aviso de brecha del encargado al responsable: ¿qué horas pactar para dejar margen a las 72 h del responsable? [NV]
8. Auditoría: ¿frecuencia, preaviso, reparto de costes y confidencialidad del auditor son proporcionados?
9. ¿Qué contenido mínimo y valor probatorio debe tener el certificado de borrado? ¿Qué plazo para borrado de copias de seguridad es defendible?
10. ¿Debo llevar registro de actividades como encargado? ¿Qué contenido? [NV]

## C. Transferencias y subencargados
11. ¿Basta con residencia UE de los datos si el proveedor tiene matriz o soporte en EE. UU.? ¿Qué análisis y garantías pide el acceso remoto?
12. ¿Cuál es el estado actual del marco UE–EE. UU. y del recurso pendiente? Preferiría un diseño que no dependa de él. [NV a hoy]
13. ¿Qué debo exigir por escrito al proveedor del modelo (región de inferencia y almacenamiento, retención, no entrenamiento)? Las fuentes sobre residencia UE de la API directa de Anthropic frente a Bedrock/Vertex/Foundry discrepan. [NV]
14. Canal de aprobación (Telegram, Slack, correo, panel propio): ¿alguno es aceptable con solo ID de referencia y verbo, o con resumen mínimo?

## D. Datos sensibles y EIPD
15. Con este perfil de cliente, ¿es obligatoria una evaluación de impacto? ¿Quién la hace, el cliente o yo con él?
16. Los datos de categoría especial (salud, opiniones, afiliación, etc.) y penales llegan por el buzón sin avisar. Mi diseño los excluye por regla y no los envía al modelo: ¿es suficiente? ¿Qué base jurídica necesita el cliente si aun así se tratan?
17. ¿Qué información debe dar el cliente a sus contactos sobre este tratamiento?

## E. Condiciones del servicio y responsabilidad (documento 03)
18. Límite de responsabilidad propuesto (12 meses de cuota, cifra sin base, a decidir contigo): ¿es válido en España? ¿Qué supuestos no se pueden limitar (dolo, culpa grave, otros) y cómo redactar la carve-out?
19. ¿Aplica el límite frente a interesados y sanciones? ¿Cómo convive con la responsabilidad del encargado y de los subencargados?
20. ¿Qué cuenta en «cuotas de N meses (propuesta: 12)» cuando el contrato lleva menos de un año? ¿Entran pagos puntuales (diagnóstico, piloto, implantación)?
21. Cláusula de no ejecución de pagos y de decisión humana: ¿protege suficientemente frente a un fraude por borrador aprobado sin mirar (cambio de IBAN, etc.)?
22. Titularidad del cliente de sus cuentas y datos, y propiedad de flujos a medida y de contenido generado por IA.
23. Si el cliente actúa como persona física, ¿le aplican reglas de consumidores? ¿Cambia algo en el límite de responsabilidad?
24. Cláusula penal en el NDA: ¿conviene, y con qué criterios sin proponer cifra inventada?
25. Duración del NDA y de la confidencialidad posterior: ¿razonable? ¿Sin límite para datos personales?
26. Ley aplicable, juzgados, mediación previa.

## F. Seguros y estructura
27. ¿Qué seguro de responsabilidad civil y/o ciber es razonable y qué debe cubrir? ¿Hay requisitos del seguro sobre el contrato? [NV, sin cotización]
28. ¿Persona física autónoma o sociedad para asumir este riesgo? (Pregunta también para asesor fiscal.)

## G. Permisos y verificación de plataformas (técnico-jurídico)
29. Si `gmail.compose` permite también enviar, ¿qué obligación contractual y técnica sustituye la garantía de «no envío»? [NV: confirmar alcance en documentación primaria]
30. ¿Qué exigencias de verificación de aplicación o evaluación de seguridad de Google aplican a un uso privado para un solo cliente? [NV]
31. Permisos delegados frente a de aplicación en Microsoft 365: ¿cómo documentar lo concedido y la revocación?

## H. Información pública
32. La página «cómo protegemos tus datos» (documento 04): ¿qué afirmaciones debo retirar o matizar hasta tener pruebas? ¿Conviene aviso legal o política de privacidad propias de la web?
33. ¿Qué deber de transparencia tengo como prestador respecto a la lista de subencargados?

## I. Procedimiento
34. Plan de respuesta a brechas: qué documentar, a quién avisar y cuándo, desde el punto de vista del encargado.
35. Orden de firma recomendado: NDA, contrato de encargado, condiciones, y datos reales solo después (hasta entonces, demo con datos ficticios).

## Pendientes que no son del abogado
- Verificar en fuente primaria los puntos [NV] del análisis de riesgos (sección 8).
- Decidir el flujo de borradores y el permiso `compose` (decisión de la persona).
- Obtener por escrito la residencia UE de cada subencargado.
