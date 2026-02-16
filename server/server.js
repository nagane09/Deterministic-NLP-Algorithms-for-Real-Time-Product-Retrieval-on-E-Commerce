// server.js (CORRECTED CODE)

import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors'; // Keep this import
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import brandRouter from './routes/brandRoute.js';
import variantRouter from './routes/variantRoute.js';
import discoutRoute from './routes/discountRoutes.js';
import inventoryRoute from './routes/inventoryRoute.js';
import cartRoute from './routes/cartRoute.js';
import orderRoute from './routes/orderRoutes.js';
import paymentRoute from './routes/paymentRoutes.js';
import reviewRoute from './routes/reviewRoutes.js';
import aiRouter from './routes/aiRoute.js'; // Assuming you added this


const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🚨 CRITICAL FIX: SPECIFIC CORS CONFIGURATION
const FRONTEND_URL = 'http://localhost:5173'; // Assuming default Vite port

app.use(cors({
    origin: FRONTEND_URL,   
    credentials: true,      // REQUIRED to send/receive HTTP-only cookies (JWTs)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// ------------------------------------

// ✅ routes
app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/brand', brandRouter);
app.use("/api/variant", variantRouter);
app.use("/api/discount", discoutRoute);
app.use("/api/inventory", inventoryRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/review", reviewRoute);
app.use("/api/ai", aiRouter);
app.use("/uploads", express.static("uploads"));


app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`);
});