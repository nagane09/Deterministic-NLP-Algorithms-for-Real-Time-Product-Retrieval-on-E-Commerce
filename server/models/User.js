import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  joinedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.user || mongoose.model("User", userSchema);
export default User;
