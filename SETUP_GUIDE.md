# 🛠️ Project Marketplace - Setup & Run Guide

This guide will help you set up and run the **Project Marketplace** (Frontend + Backend + Python Engine) manually on your local machine.

---

## 📋 Prerequisites
Ensure you have the following installed:
1.  **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2.  **Python** (v3.8 or higher) - [Download](https://www.python.org/)
3.  **MongoDB** (running locally or a Cloud URI) - [Download](https://www.mongodb.com/try/download/community)

---

## 🚀 Step 1: Backend Setup
The backend handles API requests, database connections, and runs the Python script.

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    -   Create a `.env` file in the `backend/` directory (if not exists).
    -   Add the following (adjust as needed):
        ```env
        NODE_ENV=development
        PORT=5001
        MONGO_URI=mongodb://127.0.0.1:27017/project-marketplace
        JWT_SECRET=your_super_secret_key_123
        PAYPAL_CLIENT_ID=your_paypal_id (optional)
        RAZORPAY_KEY_ID=your_razorpay_id (optional)
        ```

4.  **Create Uploads Directory:**
    -   Ensure a folder named `uploads` exists inside `backend/`.
    ```bash
    mkdir uploads
    ```

5.  **Run the Backend Server:**
    ```bash
    npm start
    ```
    ✅ *You should see: `Server running in development on PORT 5001` & `MongoDB Connected`*

---

## 🐍 Step 2: Python Engine Setup (Plagiarism/Health Check)
The backend calls a Python script (`checker.py`) to verify projects.

1.  **Navigate to the script folder:**
    ```bash
    cd backend/plagiarism-engine
    ```

2.  **Install Python Libraries:**
    -   Make sure you are in the `backend/plagiarism-engine` folder.
    -   Run:
    ```bash
    pip install -r requirements.txt
    ```
    *(If `requirements.txt` is missing, install manually: `pip install requests beautifulsoup4`)*

3.  **Test the Script (Optional):**
    ```bash
    python checker.py
    ```
    *(It loops waiting for input, so just `Ctrl+C` to exit if it runs without import errors)*

---

## 💻 Step 3: Frontend Setup (Client)
The frontend is a React (Vite) application.

1.  **Open a NEW Terminal** (Keep backend running).

2.  **Navigate to the client folder:**
    ```bash
    cd client
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Run the Frontend:**
    ```bash
    npm run dev
    ```
    ✅ *You should see: `Local: http://127.0.0.1:5173/`*

---

## 🌐 Step 4: Access the App
1.  Open your browser and go to: **[http://localhost:5173](http://localhost:5173)**
2.  **Login Credentials (if seeded):**
    -   Admin: `admin@example.com` / `123456`
    -   Student: `student@example.com` / `123456`
    *(Or register a new user)*

---

## 🛠️ Troubleshooting
-   **Images not loading?** Check if `backend/uploads` folder exists.
-   **Python Script Error?** Ensure `python` command works in your terminal. On some systems, it might be `python3`.
-   **Database Error?** Ensure MongoDB Service is running manually via Task Manager or `mongod`.

---
**Happy Coding! 🚀**
