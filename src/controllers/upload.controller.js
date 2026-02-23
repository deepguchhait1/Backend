import cloudinary from "../lib/cloudinary.js";
import multer from "multer";

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "batchit-avatars",
      resource_type: "auto",
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.log("Error in uploadImage controller", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

export const uploadMiddleware = upload.single("image");
