import mongoose from "mongoose";
import fs from 'fs';

const connectDB = async () => {
    try {
        const folders = ['./uploads', './uploads/receipts'];
        folders.forEach(dir => {
            try {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                    console.log(`✅ Created directory: ${dir}`);
                }
            } catch (err) {
                console.warn(`⚠️ System is read-only or folder exists: ${dir}`);
            }
        });

        mongoose.connection.on('connected', () => console.log("✅ DataBase Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/greencart`);
    } catch (error) {
        console.error("❌ DB Connection Error:", error.message);
        process.exit(1);
    }
}

export default connectDB;