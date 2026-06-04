from datetime import date

from pydantic import BaseModel, EmailStr, field_validator


class PatientIn(BaseModel):
    full_name:   str
    dob:         date
    email:       EmailStr
    record_date: date
    glucose:     float
    haemoglobin: float
    cholesterol: float

    @field_validator("dob")
    @classmethod
    def dob_not_future(cls, v: date) -> date:
        if v >= date.today():
            raise ValueError("date of birth must be in the past")
        return v

    @field_validator("record_date")
    @classmethod
    def record_not_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("test date cannot be in the future")
        return v

    @field_validator("glucose")
    @classmethod
    def glucose_range(cls, v: float) -> float:
        if not (1 <= v <= 600):
            raise ValueError("glucose must be between 1 and 600 mg/dL")
        return v

    @field_validator("haemoglobin")
    @classmethod
    def hb_range(cls, v: float) -> float:
        if not (1 <= v <= 25):
            raise ValueError("haemoglobin must be between 1 and 25 g/dL")
        return v

    @field_validator("cholesterol")
    @classmethod
    def chol_range(cls, v: float) -> float:
        if not (1 <= v <= 600):
            raise ValueError("cholesterol must be between 1 and 600 mg/dL")
        return v


class PatientOut(PatientIn):
    id:      int
    remarks: str | None = None

    model_config = {"from_attributes": True}


class PatientPatch(BaseModel):
    full_name:   str | None       = None
    dob:         date | None      = None
    email:       EmailStr | None  = None
    record_date: date | None      = None
    glucose:     float | None     = None
    haemoglobin: float | None     = None
    cholesterol: float | None     = None
