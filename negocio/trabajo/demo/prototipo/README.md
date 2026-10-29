# Prototipo de la demo (datos ficticios, solo lectura y borradores)

Python 3 estándar, sin dependencias, sin red, sin credenciales. Especificación: `../especificacion-mvp.md`. Guion: `../guion-demo.md`.

```
python3 demo.py              # demo con el simulador honesto
python3 demo.py --ingenuo    # demo con un modelo adversario que obedece inyecciones
python3 -m unittest discover -s tests -t .   # pruebas
```

- El «modelo» es un simulador (`chief/modelo.py`). Conectar un LLM real exige decisiones de la persona (servicio, región UE, coste) y no está hecho.
- No hay ninguna función de envío ni de red; `tests/test_codigo.py` lo vigila.
- Datos solo en dominios reservados `.example` y `.test`. No añadir datos reales (condición 4).
- Estado: No verificado (condición 8).
