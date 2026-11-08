# Dashboard de ventas APEX (Streamlit)

```bash
cd dashboard
pip install -r requirements.txt
streamlit run app.py
```

## Datos reales
Crea `data/sales.csv` con las columnas: `fecha, marca, modelo, region, canal, vendedor, precio, coste, descuento_pct, lead_dias`.
Si el archivo no existe se usan datos **ficticios** (aviso visible en el panel). Para SQL/API, edita `load_data()` en `data.py`.

## Métricas (ver `metrics.py`)
Ingresos = Σ precio · Ticket = ingresos/unidades · Margen = (ingresos−coste)/ingresos · Ciclo = mediana de `lead_dias`.
Variación = frente al periodo anterior de igual duración; sin base de comparación no se muestra (sin divisiones por cero).
