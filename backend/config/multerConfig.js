const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Safe CloudinaryStorage initialization with error logs
let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      try {
        const fileName = file.originalname.split(".")[0];
        return {
          folder: "snow_white",
          resource_type: "auto",
          // Add AVIF and other common formats
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "avif"],
          public_id: `${Date.now()}-${fileName}`,
        };
      } catch (err) {
        console.error("Error generating Cloudinary params:", err);
        throw err; // rethrow so multer knows there was an error
      }
    },
  });
  console.log("Cloudinary storage initialized successfully.");
} catch (err) {
  console.error("Failed to initialize Cloudinary storage:", err);
}

// Multer upload instance with file filter and error logging
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|webp|gif|bmp|svg|avif/;
    const ext = file.originalname.split(".").pop().toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      console.error(`Invalid file type: ${file.originalname} (${file.mimetype})`);
      cb(
        new Error(
          "Only image files (jpg, jpeg, png, webp, gif, bmp, svg, avif) are allowed!"
        )
      );
    }
  },
});

// Middleware wrapper to catch multer errors
const uploadWithLogging = (req, res, next) => {
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ])(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = uploadWithLogging;
