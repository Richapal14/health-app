from sqlalchemy.orm import Session

from models import Patient
from schemas import PatientIn, PatientPatch


def list_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Patient).offset(skip).limit(limit).all()


def get_patient(db: Session, pid: int):
    return db.query(Patient).filter(Patient.id == pid).first()


def create_patient(db: Session, data: PatientIn) -> Patient:
    row = Patient(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_patient(db: Session, pid: int, data: PatientPatch) -> Patient | None:
    row = get_patient(db, pid)
    if not row:
        return None
    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(row, field, val)
    row.remarks = None  # stale after any edit — force regeneration
    db.commit()
    db.refresh(row)
    return row


def set_remarks(db: Session, pid: int, text: str) -> Patient | None:
    row = get_patient(db, pid)
    if not row:
        return None
    row.remarks = text
    db.commit()
    db.refresh(row)
    return row


def delete_patient(db: Session, pid: int) -> bool:
    row = get_patient(db, pid)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
