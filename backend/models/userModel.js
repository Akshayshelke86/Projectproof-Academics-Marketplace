import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true

    },
    password: {
        type: String,
        required: true
    },
    isFreelancer: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'guide', 'client'],
        default: 'student'
    },
    // Wallet System
    walletBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },

    // Wishlist
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],

    // Referral System
    referralCode: {
        type: String,
        unique: true,
        sparse: true // Allows multiple nulls if any old docs exist
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.deleteUser = async function () {
    await this.deleteOne()
}

userSchema.pre("save", async function (next) {
    if (!this.referralCode) {
        // Generate a 6-character random referral code
        this.referralCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    }

    if (!this.isModified("password")) {
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)

export default User