'use client';

import { motion } from 'framer-motion';

export default function NoteCard({ note, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {note.note_title}
        </h3>
        <p className="text-gray-600 text-sm">
          {truncateContent(note.note_content)}
        </p>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{formatDate(note.created_on)}</span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.note_id);
            }}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
