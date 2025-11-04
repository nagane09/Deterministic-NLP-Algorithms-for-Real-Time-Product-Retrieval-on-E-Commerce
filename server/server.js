import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
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

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors()); // simple version for now

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
app.use("/uploads", express.static("uploads"));



app.listen(port, () => {
  console.log(`Server is Running on http://localhost:${port}`);
});
