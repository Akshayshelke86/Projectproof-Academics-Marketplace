import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, html }) => {
    // If SMTP credentials are set, try sending real email
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT, // 587 or 465
                secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const info = await transporter.sendMail({
                from: `"ProjectProof Marketplace" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                html: html,
            });

            console.log("Message sent: %s", info.messageId);
            return info;
        } catch (error) {
            console.error("Email Sending Failed:", error);
        }
    } else {
        // Mock Email (Print to Console if not configured)
        console.log("\n--- [EMAIL SIMULATION] ---");
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`CONTENT: ${html.substring(0, 100)}...`); // Truncate html for logs
        console.log("--------------------------\n");
        return { messageId: "mock-12345" };
    }
}

export default sendEmail
