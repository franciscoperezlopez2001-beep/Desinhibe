"""Dashboard de ventas de concesionario (APEX). Ejecuta: streamlit run app.py"""
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

from data import load_data
from metrics import delta, kpis, monthly

BRAND_COLORS = {"Ferrari": "#dc0000", "Lamborghini": "#ffd400", "Porsche": "#2f7bff"}
FMT_USD = lambda v: "—" if v is None else (f"${v/1e6:,.2f} M" if abs(v) >= 1e6 else f"${v:,.0f}")

st.set_page_config(page_title="APEX · Ventas", page_icon="🏁", layout="wide")
st.markdown("""<style>
.block-container{padding-top:1.5rem}
[data-testid="stMetric"]{background:#16161a;border:1px solid #26262c;border-radius:12px;padding:14px 16px}
h1,h2,h3{letter-spacing:.02em}
</style>""", unsafe_allow_html=True)


@st.cache_data(show_spinner="Cargando ventas…")
def get_data():
    return load_data()


try:
    df_all, synthetic = get_data()
except Exception as e:  # estado de error
    st.error(f"No se pudieron cargar los datos: {e}")
    st.stop()

# ── Filtros globales ──────────────────────────────────────────────
with st.sidebar:
    st.header("Filtros")
    dmin, dmax = df_all.fecha.min().date(), df_all.fecha.max().date()
    start_default = max(dmin, (pd.Timestamp(dmax) - pd.DateOffset(months=6)).date())
    rango = st.date_input("Periodo", (start_default, dmax), min_value=dmin, max_value=dmax)
    marcas = st.multiselect("Marca", sorted(df_all.marca.unique()), default=sorted(df_all.marca.unique()))
    regiones = st.multiselect("Región", sorted(df_all.region.unique()), default=sorted(df_all.region.unique()))
    canales = st.multiselect("Canal", sorted(df_all.canal.unique()), default=sorted(df_all.canal.unique()))

if not (isinstance(rango, tuple) and len(rango) == 2):
    st.info("Selecciona fecha de inicio y de fin.")
    st.stop()
ini, fin = pd.Timestamp(rango[0]), pd.Timestamp(rango[1])
mask = df_all.marca.isin(marcas) & df_all.region.isin(regiones) & df_all.canal.isin(canales)
df = df_all[mask & df_all.fecha.between(ini, fin)]
span = fin - ini
prev = df_all[mask & df_all.fecha.between(ini - span - pd.Timedelta(days=1), ini - pd.Timedelta(days=1))]

st.title("🏁 APEX · Panel de ventas")
if synthetic:
    st.warning("Datos **ficticios** de ejemplo. Coloca tu CSV en `dashboard/data/sales.csv` para usar datos reales.")
if df.empty:
    st.info("No hay ventas con los filtros seleccionados.")
    st.stop()

# ── KPIs ──────────────────────────────────────────────────────────
k, kp = kpis(df), kpis(prev)
m = monthly(df)
items = [
    ("Ingresos", FMT_USD(k["ingresos"]), delta(k["ingresos"], kp["ingresos"]), m.ingresos),
    ("Unidades", f'{k["unidades"]:,}', delta(k["unidades"], kp["unidades"]), m.unidades),
    ("Ticket medio", FMT_USD(k["ticket"]), delta(k["ticket"], kp["ticket"]), None),
    ("Margen", "—" if k["margen"] is None else f'{k["margen"]:.1%}',
     None if k["margen"] is None or kp["margen"] is None else (k["margen"] - kp["margen"]) * 100, m.margen),
    ("Ciclo de venta", f'{k["ciclo"]:.0f} días', delta(k["ciclo"], kp["ciclo"]), None),
]
for col, (label, val, d, spark) in zip(st.columns(len(items)), items):
    with col:
        if d is None:
            txt = None
        elif label == "Margen":
            txt = f"{d:+.1f} pp"
        else:
            txt = f"{d:+.1%}"
        st.metric(label, val, txt, delta_color="inverse" if label == "Ciclo de venta" else "normal",
                  help="Comparado con el periodo anterior de igual duración.")
        if spark is not None and len(spark) > 1:
            f = go.Figure(go.Scatter(y=spark.fillna(0), mode="lines", line=dict(color="#dc0000", width=2),
                                     fill="tozeroy", fillcolor="rgba(220,0,0,.12)"))
            f.update_layout(height=44, margin=dict(l=0, r=0, t=0, b=0), xaxis_visible=False,
                            yaxis_visible=False, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
            st.plotly_chart(f, width="stretch", config={"displayModeBar": False})

def style(fig, h=340):
    fig.update_layout(height=h, margin=dict(l=0, r=0, t=30, b=0), paper_bgcolor="rgba(0,0,0,0)",
                      plot_bgcolor="rgba(0,0,0,0)", legend_title_text="", font_color="#ececec")
    fig.update_xaxes(gridcolor="#26262c"); fig.update_yaxes(gridcolor="#26262c")
    return fig

# ── Tendencia ─────────────────────────────────────────────────────
st.subheader("Evolución mensual de ingresos por marca")
mb = (df.set_index("fecha").groupby("marca").resample("MS")["precio"].sum().reset_index())
fig = px.area(mb, x="fecha", y="precio", color="marca", color_discrete_map=BRAND_COLORS,
              labels={"precio": "Ingresos (USD)", "fecha": ""})
st.plotly_chart(style(fig), width="stretch")

# ── Comparativas ──────────────────────────────────────────────────
c1, c2 = st.columns(2)
with c1:
    st.subheader("Ranking de modelos")
    r = (df.groupby(["modelo", "marca"]).agg(ingresos=("precio", "sum"), unidades=("precio", "size"))
         .reset_index().sort_values("ingresos"))
    fig = px.bar(r, x="ingresos", y="modelo", color="marca", orientation="h",
                 color_discrete_map=BRAND_COLORS, hover_data={"unidades": True},
                 labels={"ingresos": "Ingresos (USD)", "modelo": ""})
    st.plotly_chart(style(fig, 380), width="stretch")
with c2:
    st.subheader("Ingresos por región y canal")
    rc = df.groupby(["region", "canal"])["precio"].sum().reset_index()
    fig = px.bar(rc, x="region", y="precio", color="canal", barmode="stack",
                 color_discrete_sequence=["#dc0000", "#ffd400", "#2f7bff", "#8a8f98"],
                 labels={"precio": "Ingresos (USD)", "region": ""})
    st.plotly_chart(style(fig, 380), width="stretch")

c3, c4 = st.columns(2)
with c3:
    st.subheader("Descuento vs. margen")
    s = df.sample(min(len(df), 600), random_state=1).assign(margen=lambda d: (d.precio - d.coste) / d.precio)
    fig = px.scatter(s, x="descuento_pct", y="margen", color="marca", color_discrete_map=BRAND_COLORS,
                     opacity=.6, labels={"descuento_pct": "Descuento (%)", "margen": "Margen"})
    fig.update_yaxes(tickformat=".0%")
    st.plotly_chart(style(fig), width="stretch")
with c4:
    st.subheader("Mix de marcas")
    mix = df.groupby("marca")["precio"].sum().reset_index()
    fig = px.pie(mix, names="marca", values="precio", hole=.55, color="marca", color_discrete_map=BRAND_COLORS)
    st.plotly_chart(style(fig), width="stretch")

# ── Detalle ───────────────────────────────────────────────────────
st.subheader("Detalle de ventas")
q = st.text_input("Buscar (modelo, vendedor, región…)", "")
det = df.sort_values("fecha", ascending=False)
if q:
    det = det[det.astype(str).apply(lambda c: c.str.contains(q, case=False)).any(axis=1)]
st.dataframe(det, width="stretch", hide_index=True, height=360,
             column_config={"precio": st.column_config.NumberColumn("Precio", format="$%d"),
                            "coste": st.column_config.NumberColumn("Coste", format="$%d"),
                            "fecha": st.column_config.DateColumn("Fecha")})
st.download_button("⬇️ Exportar CSV", det.to_csv(index=False).encode("utf-8"),
                   "ventas_filtradas.csv", "text/csv")
