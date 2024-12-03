const multer = require("multer");
const storage = multer.memoryStorage(); //RAM
const upload = multer({ storage: storage });

module.exports = upload;