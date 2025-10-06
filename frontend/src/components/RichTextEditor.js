'use client';

import { useState, useEffect } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const [content, setContent] = useState(value || '');

  useEffect(() => {
    setContent(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  const applyFormat = (format) => {
    const textarea = document.getElementById('editor-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    let newCursorPos = end;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newCursorPos = end + 4;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newCursorPos = end + 2;
        break;
      case 'heading':
        formattedText = `# ${selectedText}`;
        newCursorPos = end + 2;
        break;
      case 'bullet':
        formattedText = `- ${selectedText}`;
        newCursorPos = end + 2;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="px-3 py-1 text-sm font-bold bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="px-3 py-1 text-sm italic bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => applyFormat('heading')}
          className="px-3 py-1 text-sm font-semibold bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="Heading"
        >
          H
        </button>
        <button
          type="button"
          onClick={() => applyFormat('bullet')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
          title="Bullet List"
        >
          •
        </button>
      </div>
      <textarea
        id="editor-textarea"
        value={content}
        onChange={handleChange}
        className="w-full p-4 min-h-[200px] focus:outline-none resize-vertical"
        placeholder="Start writing your note..."
      />
    </div>
  );
}