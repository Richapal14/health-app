from datetime import date

import httpx

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "nemotron-3-super:cloud"

_PROMPT = """You are a clinical assistant. Given the following blood test values, write a 2-sentence health remark. Be factual. Do not diagnose. Mention which values are outside normal range and suggest whether follow-up is advisable.

Patient age: {age} years
Test date: {record_date}
Glucose: {glucose} mg/dL  (normal fasting: 70–99)
Haemoglobin: {hb} g/dL  (normal: 12.0–17.5)
Cholesterol: {chol} mg/dL  (desirable: <200)

Respond with the remark only. No preamble."""


def _calc_age(dob: date) -> int:
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


async def generate_remark(glucose: float, hb: float, chol: float, dob: date, record_date: date) -> str:
    prompt = _PROMPT.format(
        age=_calc_age(dob),
        record_date=record_date.isoformat(),
        glucose=glucose,
        hb=hb,
        chol=chol,
    )
    payload = {"model": MODEL, "prompt": prompt, "stream": False}

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(OLLAMA_URL, json=payload)
        resp.raise_for_status()
        return resp.json()["response"].strip()
