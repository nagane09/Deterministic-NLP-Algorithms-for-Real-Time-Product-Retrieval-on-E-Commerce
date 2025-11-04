import multer from "multer";
import path from "path";

// 🗂 Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ✅ File filter — now accepts .jfif and any common image type
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // allow all common image types including jfif
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".jfif"];

  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    console.log("Rejected file:", file.originalname, "type:", file.mimetype);
    cb(new Error("Only image files are allowed!"), false);
  }
};

// 🧰 Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default upload;
