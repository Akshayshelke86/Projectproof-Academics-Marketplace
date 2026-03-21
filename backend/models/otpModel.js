import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, expires: '10m', default: Date.now } // Document auto-deletes after 10 mins
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
