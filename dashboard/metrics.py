"""Fórmulas de las métricas. Casos límite: sin ventas -> 0 / None, nunca división por cero."""
import pandas as pd


def safe_div(a, b):
    return a / b if b else None


def kpis(df: pd.DataFrame) -> dict:
    """Ingresos = suma(precio) · Margen = (precio-coste)/precio · Ticket = ingresos/unidades
    · Descuento = media(descuento_pct) · Ciclo = mediana(lead_dias)."""
    rev = float(df["precio"].sum())
    return {
        "ingresos": rev,
        "unidades": int(len(df)),
        "ticket": safe_div(rev, len(df)),
        "margen": safe_div(rev - float(df["coste"].sum()), rev),
        "descuento": float(df["descuento_pct"].mean()) if len(df) else None,
        "ciclo": float(df["lead_dias"].median()) if len(df) else None,
    }


def delta(cur, prev):
    """Variación relativa; None si no hay base de comparación."""
    if cur is None or prev in (None, 0):
        return None
    return (cur - prev) / abs(prev)


def monthly(df: pd.DataFrame) -> pd.DataFrame:
    return (df.set_index("fecha").resample("MS")
            .agg(ingresos=("precio", "sum"), unidades=("precio", "size"), coste=("coste", "sum"))
            .assign(margen=lambda d: (d.ingresos - d.coste) / d.ingresos.where(d.ingresos > 0)))
