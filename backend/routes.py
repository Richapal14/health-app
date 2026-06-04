from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
from ai import generate_remark
from database import get_db
from schemas import PatientIn, PatientOut, PatientPatch

router = APIRouter()

DB = Annotated[Session, Depends(get_db)]


@router.get("/patients", response_model=list[PatientOut])
def list_patients(db: DB):
    return crud.list_patients(db)


@router.get("/patients/{pid}", response_model=PatientOut)
def get_patient(pid: int, db: DB):
    row = crud.get_patient(db, pid)
    if not row:
        raise HTTPException(404, "patient not found")
    return row


@router.post("/patients", response_model=PatientOut, status_code=201)
def create_patient(body: PatientIn, db: DB):
    return crud.create_patient(db, body)


@router.patch("/patients/{pid}", response_model=PatientOut)
def update_patient(pid: int, body: PatientPatch, db: DB):
    row = crud.update_patient(db, pid, body)
    if not row:
        raise HTTPException(404, "patient not found")
    return row


@router.delete("/patients/{pid}", status_code=204)
def delete_patient(pid: int, db: DB):
    if not crud.delete_patient(db, pid):
        raise HTTPException(404, "patient not found")


@router.post("/patients/{pid}/remarks", response_model=PatientOut)
async def gen_remarks(pid: int, db: DB):
    row = crud.get_patient(db, pid)
    if not row:
        raise HTTPException(404, "patient not found")
    try:
        text = await generate_remark(row.glucose, row.haemoglobin, row.cholesterol, row.dob, row.record_date)
    except httpx.ConnectError:
        raise HTTPException(503, "Ollama not running — start it with: ollama serve")
    except httpx.HTTPStatusError as e:
        raise HTTPException(502, f"model error: {e.response.text}")
    updated = crud.set_remarks(db, pid, text)
    return updated
