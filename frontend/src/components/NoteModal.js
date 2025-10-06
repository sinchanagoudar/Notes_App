'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RichTextEditor from './RichTextEditor';

export default function NoteModal({ isOpen, onClose, onSave, note }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (note) {
      setTitle(note.note_title || '');
      setContent(note.note_content || '');
    } else {
      setTitle('');
      setContent('');
    }
    setErrors({});
  }, [note, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        note_title: title,
        note_content: content,
      });
      setTitle('');
      setContent('');
      setErrors({});
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-40"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-amber-100 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-200"
        >
          {/* Window Header */}
          <div className="bg-orange-200 px-4 py-2 flex justify-between items-center border-b-2 border-orange-300 sticky top-0">
            <span className="text-sm font-medium text-gray-700">
              {note ? 'Edit Note' : 'Create Note'}
            </span>
            <div className="flex gap-1.5 items-center">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors"
              ></button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {note ? 'Edit Your Note' : 'Create New Note'}
            </h2>

            <div className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white ${
                    errors.title ? 'border-red-400' : 'border-gray-300'
                  }`}
                  placeholder="Enter note title"
                />
                {errors.title && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note Content
                </label>
                <RichTextEditor value={content} onChange={setContent} />
                {errors.content && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.content}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-md border-2 border-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-green-400 hover:bg-green-500 text-gray-800 font-semibold rounded-md border-2 border-green-500 transition-colors"
              >
                {note ? 'Update Note' : 'Create Note'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}