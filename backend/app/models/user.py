from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
import uuid

class User(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_name: str
    user_email: EmailStr
    password: str
    last_update: datetime = Field(default_factory=datetime.utcnow)
    created_on: datetime = Field(default_factory=datetime.utcnow)