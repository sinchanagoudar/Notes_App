# Notes_App
Full-stack framework for building A simple and intuitive notes-taking app that helps you organize your thoughts, ideas, and tasks in one place. Quickly create, edit, and manage notes, set reminders, and keep your information easily accessible anytime
Full Stack Notes Taking Application
A modern, secure note-taking application built with Next.js (React) frontend and FastAPI (Python) backend, featuring JWT authentication, rich text editing, and smooth animations.

# Features

User Authentication: Secure JWT-based authentication system
CRUD Operations: Create, Read, Update, and Delete notes
Rich Text Editor: Custom-built rich text editor with formatting options
Responsive Design: Mobile-first design using Tailwind CSS
Smooth Animations: Framer Motion animations for enhanced UX
State Management: Redux Toolkit for efficient state management
SEO Optimized: Meta tags and SEO-friendly structure
MongoDB Database: NoSQL database for flexible data storage
Docker Support: Fully containerized application

# Tech Stack 

## Frontend

Framework: Next.js 14 (React 18)
State Management: Redux Toolkit
HTTP Client: Axios
Animations: Framer Motion
Styling: Tailwind CSS (hand-crafted components, no UI libraries)
Language: JavaScript

## Backend

Framework: FastAPI
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Password Hashing: Passlib with bcrypt
Language: Python 3.11

# Prerequisites
Before you begin, ensure you have the following installed:

Docker (version 20.10 or higher)
Docker Compose (version 2.0 or higher)
Git

#  Installation & Setup
git clone <repo-url>
cd notes-app

# Environment Configuration
Backend (.env)
Create backend/.env:
envMONGODB_URL=mongodb://mongodb:27017
DATABASE_NAME=notes_app
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

Frontend (.env.local) NEXT_PUBLIC_API_URL=http://localhost:8000

# Run with Docker
Start all services with Docker Compose: docker-compose up --build

This command will:

Build and start MongoDB container
Build and start FastAPI backend container
Build and start Next.js frontend container

#  Access the Application
 Access the Application
 Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Documentation: http://localhost:8000/docs (Swagger UI)
Alternative API Docs: http://localhost:8000/redoc (ReDoc)

frontend - npm run dev 
backend - python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload

# Usage

1. Create an Account

Navigate to http://localhost:3000
Click "Sign up" link
Fill in your details (name, email, password)
Click "Sign Up"

2. Sign In

After registration, you'll be redirected to sign in
Enter your email and password
Click "Sign In"

3. Create Notes

Once logged in, click "+ New Note" button
Enter a title and content
Use the rich text editor toolbar for formatting:

B for bold text
I for italic text
H for headings
• for bullet lists


Click "Create" to save

4. Manage Notes

View: All notes are displayed on the home page
Edit: Click "Edit" button on any note card
Delete: Click "Delete" button (with confirmation)
Sign Out: Click "Sign Out" in the header