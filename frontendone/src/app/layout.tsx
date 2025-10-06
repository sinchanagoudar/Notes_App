'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Notes App - Your Personal Note Taking Application</title>
        <meta name="description" content="A modern, secure note-taking application built with Next.js and FastAPI" />
        <meta name="keywords" content="notes, note-taking, productivity, React, Next.js" />
        <meta property="og:title" content="Notes App" />
        <meta property="og:description" content="Organize your thoughts with our secure note-taking app" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}