const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer")

router.post("/upload", upload.single("image"), (req, res) => {
  console.log("Request body:", req.body); // Log the incoming data
  console.log("Uploaded file:", req.file); // Log the uploaded file
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.json({ message: `File uploaded successfully: ${req.file.path}` });
});

module.exports = router;