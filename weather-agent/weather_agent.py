#!/usr/bin/env python3
"""Agente del tiempo: resume la previsión y avisa de cuándo va a llover.

Datos: Open-Meteo (gratis, sin API key).
Resumen en lenguaje natural: Claude, si hay ANTHROPIC_API_KEY (si no, plantilla local).

Uso:  python weather_agent.py "Madrid" [--horas 24] [--umbral 50]
"""
import argparse
import json
import os
import urllib.parse
import urllib.request

GEO = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST = "https://api.open-meteo.com/v1/forecast"


def get_json(url, params):
    with urllib.request.urlopen(f"{url}?{urllib.parse.urlencode(params)}", timeout=20) as r:
        return json.load(r)


def geocode(city):
    res = get_json(GEO, {"name": city, "count": 1, "language": "es"}).get("results")
    if not res:
        raise SystemExit(f"No encuentro la ciudad: {city}")
    p = res[0]
    return p["latitude"], p["longitude"], f'{p["name"]}, {p.get("country", "")}'


def fetch_forecast(lat, lon):
    return get_json(FORECAST, {
        "latitude": lat, "longitude": lon, "timezone": "auto", "forecast_days": 2,
        "hourly": "temperature_2m,precipitation_probability,precipitation",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
        "current": "temperature_2m,precipitation",
    })


def rain_alert(data, horas, umbral):
    """Devuelve las franjas horarias con lluvia probable en las próximas `horas`."""
    now = data["current"]["time"][:13]  # 'YYYY-MM-DDTHH'
    h = data["hourly"]
    start = next((i for i, t in enumerate(h["time"]) if t[:13] >= now), 0)
    franjas, actual = [], None
    for i in range(start, min(start + horas, len(h["time"]))):
        prob = h["precipitation_probability"][i] or 0
        mm = h["precipitation"][i] or 0
        llueve = prob >= umbral or mm >= 0.2
        if llueve and actual is None:
            actual = {"desde": h["time"][i], "hasta": h["time"][i], "prob_max": prob, "mm": mm}
        elif llueve:
            actual.update(hasta=h["time"][i], prob_max=max(actual["prob_max"], prob), mm=actual["mm"] + mm)
        elif actual:
            franjas.append(actual)
            actual = None
    if actual:
        franjas.append(actual)
    return franjas


def build_facts(lugar, data, franjas, horas):
    d = data["daily"]
    return {
        "lugar": lugar,
        "ahora_c": data["current"]["temperature_2m"],
        "hoy": {"min": d["temperature_2m_min"][0], "max": d["temperature_2m_max"][0],
                "lluvia_mm": d["precipitation_sum"][0]},
        "manana": {"min": d["temperature_2m_min"][1], "max": d["temperature_2m_max"][1],
                   "lluvia_mm": d["precipitation_sum"][1]},
        "horas_analizadas": horas,
        "franjas_de_lluvia": franjas,
    }


def alert_text(franjas):
    if not franjas:
        return "☀️ Sin lluvia prevista en el periodo analizado."
    f = franjas[0]
    s = (f"🌧️ AVISO: lloverá desde las {f['desde'][11:16]} hasta las {f['hasta'][11:16]} "
         f"(prob. máx. {f['prob_max']}%, ~{f['mm']:.1f} mm).")
    if len(franjas) > 1:
        s += f" Hay {len(franjas) - 1} franja(s) más después."
    return s


def summarize(facts):
    """Resumen con Claude si hay API key; si no, plantilla local."""
    if os.environ.get("ANTHROPIC_API_KEY"):
        try:
            import anthropic
            msg = anthropic.Anthropic().messages.create(
                model="claude-sonnet-5-5", max_tokens=400,
                system="Eres un meteorólogo amable. Resume en español, en 3-4 frases, "
                       "con consejos prácticos (paraguas, ropa). Usa solo los datos dados.",
                messages=[{"role": "user", "content": json.dumps(facts, ensure_ascii=False)}])
            return msg.content[0].text
        except Exception as e:  # sin SDK o error de red: seguimos con plantilla
            print(f"(Claude no disponible: {e})")
    h, m = facts["hoy"], facts["manana"]
    return (f"{facts['lugar']}: ahora {facts['ahora_c']}°C. Hoy entre {h['min']}° y {h['max']}° "
            f"({h['lluvia_mm']} mm de lluvia). Mañana entre {m['min']}° y {m['max']}° "
            f"({m['lluvia_mm']} mm).")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("ciudad")
    ap.add_argument("--horas", type=int, default=24, help="horas a analizar")
    ap.add_argument("--umbral", type=int, default=50, help="%% de probabilidad que cuenta como lluvia")
    a = ap.parse_args()
    lat, lon, lugar = geocode(a.ciudad)
    data = fetch_forecast(lat, lon)
    franjas = rain_alert(data, a.horas, a.umbral)
    print(summarize(build_facts(lugar, data, franjas, a.horas)))
    print()
    print(alert_text(franjas))


if __name__ == "__main__":
    main()
