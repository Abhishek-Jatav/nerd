# 📚 Student Notes Sharing Platform

A web-based platform built to simplify the sharing and access of academic notes among students. The platform enables students to upload, browse, and download study materials, creating a collaborative academic environment.

---

## 🚀 Features

- 📤 Upload notes by registered users
- 📥 Download notes contributed by others
- 🔍 Search and filter notes by subject, title, or contributor
- 👤 User authentication with Firebase
- ✅ Admin panel for managing contributions
- ⚙️ Realtime data using Firebase Realtime Database
- 📁 File storage using Firebase Storage

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Firebase (Realtime Database + Storage + Auth)
- **Authentication**: Google OAuth (via Firebase)
- **Hosting**: Vercel / Firebase Hosting (optional)

---

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhishek-Jatav/student-notes-platform.git](https://github.com/Abhishek-Jatav/nerd
   cd nerd
2. Install dependencies
   npm install


3. Configure Firebase

   Create a project on Firebase Console

   Enable Authentication (Google Sign-In)

   Setup Realtime Database and Storage

   Create a .env.local file with the following keys:

      NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
      NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_db_url
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_msg_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

4. Run the development server
      npm run dev
