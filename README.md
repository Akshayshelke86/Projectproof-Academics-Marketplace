# 🚀 ProjectProof Marketplace – The Verified Academic Project Hub

**ProjectProof** is a professional, high-security academic project marketplace building trust through **Plagiarism Detection**, **Secure Watermarked Downloads**, and **Verified Submission Protocols**. Designed for students, researchers, and developers to trade academic excellence with confidence.

---

## ✨ Premium Features

### 🛡️ 1. Anti-Piracy & Secure Downloads
- **Watermarked ZIPs**: Every download injects a unique, encrypted license file (`LICENSE_PROJECTPROOF.txt`) containing the buyer's Name, Email, and Purchase ID.
- **Dynamic license Injection**: Backend on-the-fly modification of source code archives using `adm-zip`.
- **Anti-Sharing Triggers**: Tracks download fingerprints to prevent unauthorized secondary distribution.

### 🕵️ 2. Plagiarism & Originality Engine
- **Automated GitHub Scanning**: Scans every submission against millions of public repositories.
- **Similarity Scoring**: Provides a 0-100% originality score before the project can be published.
- **Diff Analysis**: Generates detailed reports highlighting unique logic vs. copied code.

### 💳 3. Secure Transactions & Auth
- **Razorpay Integration**: Native Indian payment gateway support with automated order tracking.
- **Email OTP Verification**: Secure registration via Gmail SMTP (App Passwords) to eliminate fake accounts.
- **Google OAuth**: Fast login for a frictionless user experience.

### 🌐 4. Seller & Buyer Experience
- **Live Demo URLs**: Optional links to live hosting (Vercel/Netlify) to boost buyer confidence.
- **Proof of Work**: Mandatory demo video (YouTube/Drive) and screenshots per submission.
- **SEO & Social Previews**: Dynamic OpenGraph tags for beautiful card previews when sharing on WhatsApp, LinkedIn, or Twitter.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Tailwind CSS, Redux Toolkit, Vite, React-Helmet-Async |
| **Backend** | Node.js, Express, MongoDB (Mongoose), Adm-Zip, Nodemailer |
| **Microservice** | Python 3, GitHub Search API (Plagiarism Detection) |
| **Storage** | Cloudinary (Images & ZIP Archives) |
| **Payments** | Razorpay (Test & Live Mode) |

---

## 📦 Installation & Setup

### 1. Prerequisite Repositories
```bash
git clone https://github.com/Akshayshelke86/Projectproof-Academics-Marketplace.git
cd Projectproof-Academics-Marketplace
```

### 2. Backend Setup (`/backend`)
Create a `.env` file in the `backend` folder:
```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_id
RAZORPAY_KEY_SECRET=your_secret
SMTP_USER=akshayshelk86@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM_EMAIL=akshayshelk86@gmail.com
CLOUDINARY_CLOUD_NAME=da4jjhibj
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run: `npm install` and `npm start`

### 3. Frontend Setup (`/client`)
Create a `.env` file in the `client` folder:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_id
```
Run: `npm install` and `npm run dev`

### 4. Plagiarism Engine (`/backend/plagiarism-engine`)
Run: `pip install -r requirements.txt` and `python checker.py`

---

## 📸 Screenshots & Demo
*Check the `screenshots/` folder or visit the live site for more details.*

---
*Developed with ❤️ for Academic Integrity. Verified by ProjectProof.*
