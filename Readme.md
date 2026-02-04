# DK's Toolbox

A full-stack utility web application that provides a collection of simple, useful productivity tools in a single interface.

---

## 🚀 Project Overview

**DK's Toolbox** is a web-based suite of lightweight tools designed to make common digital tasks easier. The application follows a clear frontend–backend separation and is structured to be easily extendable with additional tools in the future.

### 🔧 Current Tools Available

1. **Bulk Email Sender**

   * Send emails to multiple recipients at once.
   * Supports attachments (up to 10MB).
   * Includes a clean UI, progress indicator, and error handling.

2. **PDF Text Extractor**

   * Extract readable text from PDF files.
   * One-click processing.

3. **PDF to Word / Word to PDF Converter**

   * Convert documents between PDF and Word formats.

4. **QR Code Generator**

   * Generate custom QR codes from text or URLs.

5. **Image Compressor**

   * Reduce image file sizes while maintaining reasonable quality.

---

## 🏗️ Architecture

This project is built as a **full-stack application** with two main parts:

* **Frontend:** Next.js (React-based UI)
* **Backend:** Python-based API (Flask/FastAPI-style structure)

---

## 📁 Project Structure

```
/
│── backend/
│   ├── main.py                # Main backend server
│   ├── requirements.txt       # Python dependencies
│   ├── package.json           # (If using any Node tooling in backend)
│   └── qrcode.png             # Example/utility asset
│
│── frontend/
│   ├── .next/                 # Next.js build output
│   ├── .vercel/               # Vercel deployment config
│   ├── node_modules/          # Frontend dependencies
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   └── components/        # Reusable UI components
│   ├── .env.local             # Environment variables
│   ├── next.config.js         # Next.js configuration
│   ├── package.json           # Frontend dependencies
│   └── postcss.config.js      # Styling configuration
└── .vercel/                   # Root Vercel configuration
```

---

## ⚙️ Environment Variables

Create a file in `frontend/.env.local`:

```
NEXT_PUBLIC_LOCAL_URL=http://127.0.0.1:8000
```

This URL should point to your running backend server.

---

## ▶️ How to Run the Project Locally

### 1️⃣ Start the Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2️⃣ Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## 📌 Future Improvements

* User authentication
* Cloud storage for files
* History of conversions
* Drag-and-drop dashboard customization
* More utility tools

---

## 👨‍💻 Author

DK (Daksh Kohli)

---

Feel free to extend this project or contribute new tools! 🚀
