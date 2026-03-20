# ProjectProof – Verified Academic Projects

**ProjectProof** is a verified academic project selling platform designed to ensure originality and quality for final year students and researchers. Unlike standard marketplaces, every project here undergoes a rigorous **Plagiarism & Similarity Check** against public GitHub repositories before being listed.

## 🚀 Key Features

### 1. Multi-Role System
- **Student**: Upload projects, request reviews, view similarity reports.
- **Admin**: Review queue, automated GitHub similarity check, approve/reject, publish.
- **Guide**: View-only access to verify originality reports.

### 2. Final Submission Flow (Mandatory)
1.  **Draft**: Student creates project details.
2.  **Request Submission**: Student submits for review.
3.  **Under Review**: Admin triggers the **Plagiarism Engine**.
4.  **Originality Check**: System scans code against GitHub API and generates a similarity score.
5.  **Approval/Rejection**: Admin makes a final decision based on the Diff Report.
6.  **Published**: Project becomes available for purchase.

### 3. Automated Plagiarism Engine (Python Microservice)
- **Tech**: Python 3, GitHub Search API, Sequence Matching / AST Analysis.
- **Logic**: 
    - Scans local project files.
    - Searches GitHub for matching Title/Tech Stack.
    - Compares file structures and content to generate a **Similarity Score**.
    - Generates a **Diff Report** highlighting copied vs. unique logic.

### 4. Security & Trust
- **License Keys**: Unique license key generated upon purchase.
- **Watermarking**: Code fingerprinting to track reuse.
- **Strict Verification**: Only approved projects are visible to buyers.

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS (Vite)
- **Backend**: Node.js, Express, MongoDB
- ** Microservice**: Python 3 (Plagiarism Engine)
- **Database**: MongoDB (Atlas/Local)

## 📦 How to Run

1.  **Install Dependencies**
    ```bash
    # Backend
    cd backend
    npm install
    
    # Plagiarism Engine
    cd plagiarism-engine
    pip install -r requirements.txt
    
    # Frontend
    cd ../client
    npm install
    ```

2.  **Start Services**
    ```bash
    # Backend (Starts Node + Python Service when needed)
    cd backend
    npm start
    
    # Frontend
    cd client
    npm run dev
    ```

3.  **Access**
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5000`

---
*Verified by ProjectProof Architecture.*
