from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class Note(BaseModel):
    note_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    note_title: str
    note_content: str
    last_update: datetime = Field(default_factory=datetime.utcnow)
    created_on: datetime = Field(default_factory=datetime.utcnow)