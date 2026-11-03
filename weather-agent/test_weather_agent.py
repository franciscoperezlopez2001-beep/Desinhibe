import weather_agent as w

def fake(probs, mms):
    times = [f"2026-11-03T{h:02d}:00" for h in range(24)]
    return {"current": {"time": "2026-11-03T08:00", "temperature_2m": 12.0, "precipitation": 0},
            "hourly": {"time": times, "precipitation_probability": probs, "precipitation": mms},
            "daily": {"temperature_2m_max": [15, 14], "temperature_2m_min": [8, 7], "precipitation_sum": [2.0, 0]}}

probs = [0]*24; mms = [0]*24
for h in (14, 15, 16): probs[h] = 80; mms[h] = 0.7
d = fake(probs, mms)
f = w.rain_alert(d, 24, 50)
assert len(f) == 1 and f[0]["desde"].endswith("14:00") and f[0]["hasta"].endswith("16:00"), f
print(w.alert_text(f)); print(w.summarize(w.build_facts("Madrid, España", d, f, 24)))
assert "Sin lluvia" in w.alert_text(w.rain_alert(fake([0]*24, [0]*24), 24, 50))
print("OK")
