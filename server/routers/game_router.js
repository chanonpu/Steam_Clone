const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer_db");
const gameController = require('../controller/game_controller');
const { uploadGameValidator, validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/auth')

// get all game
router.get('/allgames', gameController.getAllGame);

// Route to fetch game details by ID params
router.get('/fetch/:id', gameController.getOneGameByID);

// POST to fetch game details by IDs
router.post('/games_id', gameController.getMultipleGamesByIDs)

//handle search using query
router.get("/search", gameController.searchGame)

// Route to upload new game
router.post("/upload", verifyToken, upload.single("image"), uploadGameValidator, validate, gameController.uploadGame);

// Route to fetch new releases
router.get("/new-releases", gameController.getNewReleaseGames);

// Route to fetch top-ranked games
router.get("/top-ranked", gameController.getTopRankedGames);

// route to filter the game
router.get("/filter", gameController.filterGame);

// route to update the game
router.put("/update/:id", verifyToken, upload.single("image"), uploadGameValidator, validate, gameController.updateGame);

// route to delete game
router.delete("/delete/:id", verifyToken, gameController.deleteGame);

// route to get an image
router.get("/image", gameController.getImage);


module.exports = router;