import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";

// @desc Create Razorpay Order
// @route POST /api/payment/create-order
// @access Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    // Validate Amount
    if (!amount || isNaN(amount) || amount <= 0) {
        res.status(400);
        throw new Error(`Invalid Amount: ${amount}`);
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Check for Force Mock Conditions (Missing Key, Explicit Mock Key, or Empty String)
    let forceMock = !keyId || keyId === 'MOCK_KEY' || keyId.trim() === '';

    console.log(`[PAYMENT] Create Order Request - Amount: ${amount}, Mode: ${forceMock ? 'MOCK' : 'REAL'}`);

    if (forceMock) {
        console.log("[PAYMENT] Using Mock Payment Mode (Config)");
        return sendMockOrder(res, amount);
    }

    try {
        const instance = new Razorpay({
            key_id: keyId,
            key_secret: secret,
        });

        const options = {
            amount: Number(amount * 100),
            currency: "INR",
            receipt: "order_rcptid_" + Math.floor(Math.random() * 1000),
        };

        const order = await instance.orders.create(options);
        res.json(order);

    } catch (rzpError) {
        console.error("[PAYMENT] Razorpay Error:", rzpError.message);
        console.log("[PAYMENT] Fallback to Mock Payment Mode due to Error");
        return sendMockOrder(res, amount);
    }
});

const sendMockOrder = (res, amount) => {
    const mockOrder = {
        id: "order_mock_" + Math.floor(Math.random() * 100000),
        currency: "INR",
        amount: amount * 100,
        status: "created",
        attempts: 0
    };
    res.json(mockOrder);
};

// @desc Verify Razorpay Payment and Update Order
// @route POST /api/payment/verify
// @access Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const isMock = razorpay_payment_id.startsWith('pay_mock_') || !process.env.RAZORPAY_KEY_ID;

    let isAuthentic = false;

    if (isMock) {
        console.log("[PAYMENT] Verifying Mock Payment - SKIP Signature");
        isAuthentic = true;
    } else {
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
        // Return success so frontend can create the order
        res.json({
            message: "Payment verified successfully",
            paymentResult: {
                id: razorpay_payment_id,
                status: "success",
                update_time: Date.now(),
                email_Address: req.user.email,
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature
            }
        });
    } else {
        res.status(400);
        throw new Error("Payment verification failed");
    }
});

export { createRazorpayOrder, verifyPayment };
