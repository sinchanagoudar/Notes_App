import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  selectedNote: null,
  loading: false,
  error: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedNote: (state, action) => {
      state.selectedNote = action.payload;
    },
    addNote: (state, action) => {
      state.notes.unshift(action.payload);
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex((note) => note.note_id === action.payload.note_id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    removeNote: (state, action) => {
      state.notes = state.notes.filter((note) => note.note_id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setNotes,
  setSelectedNote,
  addNote,
  updateNote,
  removeNote,
  setLoading,
  setError,
} = notesSlice.actions;

export default notesSlice.reducer;