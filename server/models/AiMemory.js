import mongoose from "mongoose";

const aiMemorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastSearchResults: { type: Array, default: [] },
  stage: { type: String, default: "idle" },
  pendingOrder: { type: Object, default: {} }
});

export default mongoose.model("AiMemory", aiMemorySchema);
