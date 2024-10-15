// adding multer
const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
  // the function that saves the file
  destination: function (req, file, cb) {
    // where we are storing the file
    cb(null, path.join(__dirname, "../data/img"));
  },
  filename: function (req, file, cb) {
    // what is the filename going to be
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage }); // the middleware function that handles uploading

module.exports = upload;