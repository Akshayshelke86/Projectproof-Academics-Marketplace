import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"

const protect = asyncHandler(async (req, res, next) => {
    let token
    const secret = process.env.JWT_SECRET;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, secret)
            req.user = await User.findById(decoded.id).select("-password")
            return next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error("Not authorized, token failed")
        }
    }

    if (!token) {
        res.status(401)
        throw new Error("Not authorized, no token")
    }
})

// Optional protection (populates req.user if token exists, but doesn't block if not)
const optionalProtect = asyncHandler(async (req, res, next) => {
    let token
    const secret = process.env.JWT_SECRET;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, secret)
            req.user = await User.findById(decoded.id).select("-password")
        } catch (error) {
            console.error("Optional Auth Failed:", error.message)
        }
    }
    next()
})

const admin = (req, res, next) => {
    if (req.user && (req.user.isAdmin || req.user.role === 'admin' || req.user.role === 'guide')) {
        next()
    } else {
        res.status(401)
        throw new Error("Not authorized as an admin or guide!")
    }
}

export { protect, optionalProtect, admin }