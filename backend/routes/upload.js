const express = require("express");
const multer = require("multer");
const fileUploader = require("../lib/fileUploader");
const router = express.Router();

const upload = multer({ dest: "uploads/" }); // Files are temporarily saved in 'uploads/'
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("File received:", req.file);
    // File info from multer
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    // Upload the file to S3
    const result = await fileUploader(fileName, filePath);
    return res
      .status(200)
      .json({ message: "File uploaded successfully", result });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "File upload failed", error });
  }
});

module.exports = router;
