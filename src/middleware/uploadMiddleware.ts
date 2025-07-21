import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import type { UploadApiOptions } from "cloudinary";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (): Promise<UploadApiOptions> => {
    return {
      folder: "field_uploads", // Sesuaikan dengan folder yang diinginkan
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 800, height: 600, crop: "fill" }], // Opsional: transformasi gambar
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.mimetype)) {
      return cb(new Error("Please upload a valid image (JPEG, PNG, GIF)."));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
});

export default upload;
