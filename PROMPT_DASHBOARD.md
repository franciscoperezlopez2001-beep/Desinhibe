# Prompt profesional para crear un dashboard

Rellena lo que va entre `[corchetes]` y borra lo que no aplique.

```text
Actúa como un analista de datos senior y diseñador de producto especializado en dashboards. Diseña y construye un dashboard de [tipo: ventas / marketing / finanzas / operaciones / producto / RR. HH.] para [tipo de usuario: dirección / equipo comercial / analista].

## 1. Objetivo y decisiones
- Objetivo principal del dashboard: [ej. monitorizar el rendimiento mensual de ventas].
- Decisiones que debe permitir tomar: [ej. dónde invertir más, qué productos descatalogar].
- Frecuencia de uso: [diaria / semanal / mensual]. Dispositivo principal: [escritorio / móvil].

## 2. Datos
- Fuente(s): [CSV, Excel, Google Sheets, SQL, API, Shopify…].
- Campos disponibles: [lista de columnas con su tipo].
- Periodo y granularidad: [ej. últimos 12 meses, por día].
- Si faltan datos, genera un dataset de ejemplo realista y márcalo claramente como ficticio.

## 3. KPIs y métricas
- KPIs principales (máximo 4-6 en la parte superior): [ej. ingresos, nº de pedidos, ticket medio, tasa de conversión].
- Para cada KPI: valor actual, comparación con el periodo anterior (% y flecha de tendencia) y un sparkline.
- Define la fórmula de cada métrica y cómo se trata cada caso límite (nulos, divisiones por cero).

## 4. Visualizaciones
- Evolución temporal: [gráfico de líneas/áreas].
- Comparativas por categoría: [barras ordenadas].
- Composición: [barras apiladas o donut, solo si hay pocas categorías].
- Detalle: [tabla con orden, búsqueda y paginación].
- Elige el tipo de gráfico según lo que se quiere comunicar. Evita 3D, gráficos circulares con muchas categorías y ejes engañosos.

## 5. Interactividad
- Filtros globales: [fecha, región, categoría, canal].
- Tooltips informativos, y drill-down o clic en un gráfico para filtrar el resto.
- Botón para exportar datos [CSV/PDF].

## 6. Diseño y UX
- Jerarquía visual: KPIs arriba, tendencias en el centro, detalle abajo.
- Estilo: [minimalista / corporativo / oscuro]. Paleta: [colores de marca o neutra], con contraste accesible (WCAG AA).
- Soporte de modo claro y oscuro, diseño responsive y tipografía legible.
- Usa un color por significado: no uses el rojo y el verde como único indicador.
- Incluye estados de carga, vacío y error.

## 7. Stack técnico
- Tecnología: [HTML + JS con Chart.js/ECharts / React + Recharts / Python + Streamlit / Power BI / Looker Studio].
- Código limpio, comentado y modular. Sin dependencias innecesarias.

## 8. Entregables
1. Breve explicación de las decisiones de diseño y de las métricas elegidas.
2. Código completo y listo para ejecutar.
3. Instrucciones para conectar los datos reales.
4. Lista de mejoras futuras (alertas, predicciones, nuevos filtros).

## Criterios de calidad
- Se entiende en menos de 5 segundos.
- Cada elemento responde a una pregunta de negocio concreta.
- Los números son coherentes entre sí y están formateados (miles, moneda, %).
- Funciona bien en móvil y cumple los criterios de accesibilidad.

Antes de empezar, si falta información crítica, hazme un máximo de 3 preguntas. Si no, procede con supuestos razonables y decláralos al inicio.
```
