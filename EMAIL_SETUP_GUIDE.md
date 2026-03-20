# 📧 How to Setup Email Notifications (Step-by-Step)

Don't worry, it's easy! Follow these 5 steps to get your **SMTP_USER** and **SMTP_PASS**.

### Step 1: SMTP_USER (Your Email)
This is simply your Gmail address.
*   **Example:** `akshay@gmail.com`
*   Open `backend/.env` file and replace `your-email@gmail.com` with your real email.

---

### Step 2: Enable 2-Step Verification (Important!)
You cannot get an App Password without this.
1.  Go to [Google Account Security](https://myaccount.google.com/security).
2.  Scroll down to **"How you sign in to Google"**.
3.  Click on **"2-Step Verification"**.
4.  Follow the steps to turn it **ON** (using your phone number).

---

### Step 3: Get App Password (SMTP_PASS)
This is the secret code we need.
1.  Still in [Security Page](https://myaccount.google.com/security), search specifically for **"App Passwords"** in the top search bar (or look under 2-Step Verification).
2.  Provide a name, e.g., `ProjectMarketplace`.
3.  Click **Create**.
4.  Google will show you a **16-character code** in a yellow box (like: `abcd efgh ijkl mnop`).
5.  **COPY THIS CODE.**

---

### Step 4: Update .env File
Now go back to your VS Code project.
1.  Open `backend/.env`.
2.  Find this line:
    `SMTP_PASS=your-app-password`
3.  Replace it with the 16-character code you just copied (remove spaces if you want, usually works with spaces too).

### Step 5: Restart Server
1.  Go to your terminal where backend is running.
2.  Press `Ctrl + C` (to stop).
3.  Run `npm start` again.

Done! Now emails will be sent from your Gmail account. 🚀
