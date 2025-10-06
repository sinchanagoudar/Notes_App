'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import NoteModal from '../components/NoteModal';
import { notesService } from '../services/notesService';
import { authService } from '../services/authService';
import {
  setNotes,
  addNote,
  updateNote,
  removeNote,
  setLoading,
  setError,
} from '../store/slices/notesSlice';
import { logout } from '../store/slices/authSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { notes, loading, error } = useSelector((state: any) => state.notes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  type NoteType = { note_id: string; [key: string]: any } | null;
  const [selectedNote, setSelectedNote] = useState<NoteType>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      dispatch(setLoading(true));
      const data = await notesService.getNotes();
      dispatch(setNotes(data));
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        dispatch(setError((err as any).response?.data?.detail || 'Failed to fetch notes'));
      } else {
        dispatch(setError('Failed to fetch notes'));
      }
    }
  };

  const handleCreateNote = async (noteData: { [key: string]: any }) => {
    try {
      const newNote = await notesService.createNote(noteData);
      dispatch(addNote(newNote));
      setIsModalOpen(false);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        // @ts-ignore
        alert((err as any).response?.data?.detail || 'Failed to create note');
      } else {
        alert('Failed to create note');
      }
    }
  };

  const handleUpdateNote = async (noteData: { [key: string]: any }) => {
    if (!selectedNote) {
      alert('No note selected for update.');
      return;
    }
    try {
      const updated = await notesService.updateNote(selectedNote.note_id, noteData);
      dispatch(updateNote(updated));
      setIsModalOpen(false);
      setSelectedNote(null);
    } catch (err) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        // @ts-ignore
        alert((err as any).response?.data?.detail || 'Failed to update note');
      } else {
        alert('Failed to update note');
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await notesService.deleteNote(noteId);
        dispatch(removeNote(noteId));
      } catch (err) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          // @ts-ignore
          alert((err as any).response?.data?.detail || 'Failed to delete note');
        } else {
          alert('Failed to delete note');
        }
      }
    }
  };

  const handleEditClick = (note: { note_id: string; [key: string]: any }) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleLogout = () => {
    authService.signout();
    dispatch(logout());
    router.push('/signin');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-amber-50">
        {/* Header */}
        <header className="bg-teal-400 border-b-2 border-teal-500 py-3 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Keep Notes</h1>
            <nav className="flex gap-6 text-sm text-gray-700 items-center">
              <Link href="/" className="font-semibold hover:text-gray-900">Home</Link>
              <a href="#" className="hover:text-gray-900">Notes</a>
              <a href="#" className="hover:text-gray-900">Account</a>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-400 hover:bg-red-500 text-gray-800 font-semibold rounded border-2 border-red-500 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Title and Action */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-2">Homepage / Notes</p>
              <h2 className="text-3xl font-bold text-gray-800">My Notes</h2>
            </div>
            <button
              onClick={() => {
                setSelectedNote(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 bg-green-400 hover:bg-green-500 text-gray-800 font-bold rounded-lg border-2 border-green-500 transition-colors shadow-md"
            >
              + Create New Note
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500"></div>
            </div>
          ) : notes.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="bg-amber-100 border-2 border-amber-200 rounded-lg p-12 max-w-md mx-auto">
                <svg
                  className="w-24 h-24 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No notes yet</h3>
                <p className="text-gray-600 mb-6">Create your first note to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-green-400 hover:bg-green-500 text-gray-800 font-semibold rounded-lg border-2 border-green-500 transition-colors"
                >
                  Create Note
                </button>
              </div>
            </motion.div>
          ) : (
            /* Notes Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {notes.map((note: { note_id: string; created_on: string; note_title: string; note_content: string; [key: string]: any }, index: number) => (
                  <motion.div
                    key={note.note_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-amber-100 rounded-lg shadow-md border-2 border-amber-200 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Note Card Header */}
                    <div className="bg-orange-200 px-4 py-2 border-b-2 border-orange-300 flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">
                        {formatDate(note.created_on)}
                      </span>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                      </div>
                    </div>

                    {/* Note Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                        {note.note_title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-4">
                        {note.note_content}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(note)}
                          className="flex-1 py-2 px-3 bg-blue-300 hover:bg-blue-400 text-gray-800 font-semibold rounded border-2 border-blue-400 transition-colors text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.note_id)}
                          className="flex-1 py-2 px-3 bg-red-300 hover:bg-red-400 text-gray-800 font-semibold rounded border-2 border-red-400 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        {/* Note Modal */}
        <NoteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={selectedNote ? handleUpdateNote : handleCreateNote}
          note={selectedNote}
        />
      </div>
    </ProtectedRoute>
  );
}
