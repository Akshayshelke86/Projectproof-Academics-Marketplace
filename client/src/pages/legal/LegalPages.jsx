import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

const legalData = {
    'terms-and-conditions': {
        title: "Terms and Conditions",
        content: `
Welcome to ProjectProof Marketplace. 
By accessing or using our platform, you agree to be bound by these Terms and Conditions. 

1. Buying Projects
When you purchase a project, you are granted a non-exclusive license to use the source code for personal, academic, or commercial purposes as defined by the project's specific license. You may not resell the exact unmodified source code on this or other platforms.

2. Selling Projects
As a seller, you confirm that you hold the copyrights to the code you upload. Uploading plagiarized or copyrighted materials belonging to third parties is strictly prohibited. ProjectProof uses advanced plagiarism detection and reserves the right to ban accounts violating these terms.

3. Payments and Affiliates
Sellers receive 90% of the sale price (or 80% if referred by an affiliate). Withdrawals are processed within 3-5 business days. The minimum withdrawal limit is ₹100.
        `
    },
    'privacy-policy': {
        title: "Privacy Policy",
        content: `
ProjectProof values your privacy. This policy outlines how we handle your data.

1. Information We Collect
We collect your name, email address, profile picture (via Google Login), and payment transaction history. Source code uploaded to the platform is stored securely on cloud servers.

2. How We Use Information
Your email is used mapping orders, withdrawals, and sending notifications. We do not sell your personal data to third parties.

3. Security
We use industry-standard encryption for database passwords and tokens. Payments are processed securely via Razorpay; we do not store your credit/debit card information on our servers.
        `
    },
    'refund-policy': {
        title: "Refund and Cancellation Policy",
        content: `
Due to the digital nature of source code, we generally do not offer refunds once a project has been purchased and the files have been downloaded.

Exceptions:
1. If the downloaded ZIP file is corrupted and the seller cannot provide a working copy within 48 hours.
2. If the project significantly deviates from the description and features listed on the marketplace.

To request a refund under these exceptions, please contact our support team within 3 days of purchase.
        `
    },
    'contact-us': {
        title: "Contact Us",
        content: `
We're here to help you!

Email Support: support@projectproof.in
Phone: +91 9876543210 (Mon-Fri, 10 AM to 6 PM IST)
Address: ProjectProof Headquarters, IT Park, Pune, Maharashtra, 411057, India.

For disputes regarding plagiarism or payments, please include your Order ID or Project ID in your communication.
        `
    }
};

const LegalPages = () => {
    const { slug } = useParams();
    const pageData = legalData[slug];

    if (!pageData) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl min-h-[60vh]">
            <h1 className="text-4xl font-black text-[var(--text-main)] mb-8 border-b border-[var(--border-color)] pb-4">
                {pageData.title}
            </h1>
            <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--text-dim)] whitespace-pre-line">
                {pageData.content.trim()}
            </div>
        </div>
    );
};

export default LegalPages;
