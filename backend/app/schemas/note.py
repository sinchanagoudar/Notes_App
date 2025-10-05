from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NoteCreate(BaseModel):
    note_title: str
    note_content: str

class NoteUpdate(BaseModel):
    note_title: Optional[str] = None
    note_content: Optional[str] = None

class NoteResponse(BaseModel):
    note_id: str
    user_id: str
    note_title: str
    note_content: str
    last_update: datetime
    created_on: datetime