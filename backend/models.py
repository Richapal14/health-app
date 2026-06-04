from datetime import date

from sqlalchemy import Date, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id:           Mapped[int]      = mapped_column(Integer, primary_key=True, index=True)
    full_name:    Mapped[str]      = mapped_column(String(120))
    dob:          Mapped[date]     = mapped_column(Date)
    email:        Mapped[str]      = mapped_column(String(180), index=True)
    record_date:  Mapped[date]     = mapped_column(Date)        # date this test was taken
    glucose:      Mapped[float]    = mapped_column(Float)
    haemoglobin:  Mapped[float]    = mapped_column(Float)
    cholesterol:  Mapped[float]    = mapped_column(Float)
    remarks:      Mapped[str|None] = mapped_column(Text, nullable=True)
