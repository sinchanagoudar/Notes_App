from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.models.note import Note
from app.database import notes_collection
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/notes", tags=["Notes"])


# Support both /notes and /notes/ (avoid 307 redirect)
@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(note_data: NoteCreate, current_user: dict = Depends(get_current_user)):
    note = Note(
        user_id=current_user["user_id"],
        note_title=note_data.note_title,
        note_content=note_data.note_content
    )
    
    notes_collection.insert_one(note.dict())
    return note

@router.get("/", response_model=List[NoteResponse])
@router.get("", response_model=List[NoteResponse])
async def get_notes(current_user: dict = Depends(get_current_user)):
    notes = list(notes_collection.find({"user_id": current_user["user_id"]}).sort("created_on", -1))
    return notes

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: str, current_user: dict = Depends(get_current_user)):
    note = notes_collection.find_one({"note_id": note_id, "user_id": current_user["user_id"]})
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return note

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note_data: NoteUpdate,
    current_user: dict = Depends(get_current_user)
):
    note = notes_collection.find_one({"note_id": note_id, "user_id": current_user["user_id"]})
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    update_data = {k: v for k, v in note_data.dict().items() if v is not None}
    update_data["last_update"] = datetime.utcnow()
    
    notes_collection.update_one(
        {"note_id": note_id},
        {"$set": update_data}
    )
    
    updated_note = notes_collection.find_one({"note_id": note_id})
    return updated_note

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: str, current_user: dict = Depends(get_current_user)):
    result = notes_collection.delete_one({"note_id": note_id, "user_id": current_user["user_id"]})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return None