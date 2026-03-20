import 'dotenv/config'
console.log("--- INDEX.JS BOOTING ---");
import express from "express"
import morgan from "morgan"
import path from "path"
import cors from "cors"
import { connectDB } from "./config/db.js"

import projectRoutes from "./routes/projectRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js"
connectDB()
const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cors())

app.use(express.json())



import submissionRoutes from "./routes/submissionRoutes.js"

app.use("/api/projects", projectRoutes)
app.use("/api/projects", submissionRoutes) // Mount submission routes under same prefix for convenience, or separate.
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/payment", paymentRoutes)


app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))
app.get("/api/config/razorpay", (req, res) => res.send(process.env.RAZORPAY_KEY_ID || 'rzp_test_1234567890'))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    app.get('/', (req, res) => {
        res.send("API is running..")
    })
    // app.use(express.static(path.join(__dirname,'/frontend/build')))
    // app.get("*",(req,res)=> res.sendFile(path.resolve(__dirname,'frontend','build','index.html')))
} else {
    app.get('/', (req, res) => {
        res.send("API is running..")
    })
}


app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5001

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
console.log("--- RAZORPAY CONFIG RELOADED ---");