"""Datos de ventas del dashboard.

load_data() devuelve un DataFrame con una fila por venta. Hoy genera datos
FICTICIOS reproducibles; para usar datos reales, pon un CSV en data/sales.csv
con las mismas columnas (ver COLUMNS) y se cargará automáticamente.
"""
from pathlib import Path

import numpy as np
import pandas as pd

COLUMNS = ["fecha", "marca", "modelo", "region", "canal", "vendedor",
           "precio", "coste", "descuento_pct", "lead_dias"]

# (marca, modelo, precio base USD, margen base, peso de popularidad)
MODELS = [
    ("Ferrari", "296 GTB", 320_000, 0.14, 5), ("Ferrari", "SF90 Stradale", 530_000, 0.16, 2),
    ("Ferrari", "12Cilindri", 464_000, 0.15, 2), ("Ferrari", "Purosangue", 400_000, 0.13, 4),
    ("Lamborghini", "Revuelto", 612_000, 0.15, 1.5), ("Lamborghini", "Temerario", 361_000, 0.13, 3),
    ("Lamborghini", "Urus SE", 262_000, 0.11, 7), ("Lamborghini", "Huracán", 250_000, 0.10, 4),
    ("Porsche", "911 Turbo S", 230_000, 0.09, 9), ("Porsche", "Taycan GT", 190_000, 0.08, 6),
    ("Porsche", "918 Spyder (reventa)", 1_800_000, 0.07, 0.3),
]
REGIONS = {"Norteamérica": 0.34, "Europa": 0.30, "Oriente Medio": 0.16, "Asia-Pacífico": 0.20}
CHANNELS = {"Showroom": 0.5, "Web": 0.2, "Evento": 0.12, "Referido": 0.18}
SELLERS = ["Giulia R.", "Marco B.", "Lena K.", "Omar S.", "Chen W.", "Sofía M."]


def _synthetic(seed: int = 7) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    end = pd.Timestamp.today().normalize()
    days = pd.date_range(end - pd.DateOffset(months=18), end, freq="D")
    # estacionalidad suave + crecimiento
    base = 1.0 + 0.25 * np.sin((days.dayofyear.values - 80) / 365 * 2 * np.pi)
    base *= np.linspace(0.85, 1.2, len(days))
    n_per_day = rng.poisson(base * 0.9)
    dates = np.repeat(days.values, n_per_day)
    n = len(dates)
    w = np.array([m[4] for m in MODELS], float)
    idx = rng.choice(len(MODELS), n, p=w / w.sum())
    price = np.array([MODELS[i][2] for i in idx]) * rng.normal(1.04, 0.05, n)  # extras
    disc = np.clip(rng.gamma(2, 1.4, n), 0, 12)
    net = price * (1 - disc / 100)
    margin = np.array([MODELS[i][3] for i in idx]) - disc / 100 * 0.35 + rng.normal(0, 0.01, n)
    return pd.DataFrame({
        "fecha": pd.to_datetime(dates),
        "marca": [MODELS[i][0] for i in idx],
        "modelo": [MODELS[i][1] for i in idx],
        "region": rng.choice(list(REGIONS), n, p=list(REGIONS.values())),
        "canal": rng.choice(list(CHANNELS), n, p=list(CHANNELS.values())),
        "vendedor": rng.choice(SELLERS, n),
        "precio": net.round(0),
        "coste": (net * (1 - margin)).round(0),
        "descuento_pct": disc.round(1),
        "lead_dias": rng.gamma(3, 12, n).round(0),
    })


def load_data():
    """Devuelve (DataFrame, es_ficticio)."""
    csv = Path(__file__).parent / "data" / "sales.csv"
    if csv.exists():
        df = pd.read_csv(csv, parse_dates=["fecha"])
        missing = set(COLUMNS) - set(df.columns)
        if missing:
            raise ValueError(f"Faltan columnas en sales.csv: {sorted(missing)}")
        return df.dropna(subset=["fecha", "precio"]), False
    return _synthetic(), True
