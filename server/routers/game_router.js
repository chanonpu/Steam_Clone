const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const Game = require("../models/game");
const User = require('../models/user');
const { uploadGameValidator, validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/auth')
const path = require("path")
const fs = require('fs');

// get all game
router.get('/allgames', async (req, res) => {
  try {
    // Query the Game collection to retrieve all games
    const games = await Game.find({});
    res.json(games);
  } catch (err) {
    console.error('Error retrieving games:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch game details by ID params
router.get('/fetch/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findOne({ _id: gameId })
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch game data' });
  }
});

// POST to fetch game details by IDs
router.post('/games_id', async (req, res) => {
  const { gameIds } = req.body;
  const games = await Game.find({ _id: { $in: gameIds } });
  res.json(games);
})

//handle search using query
router.get("/search", async (req, res) => {
  Game.find({ name: { $regex: req.query.name, $options: 'i' } })
    .then((game) => {
      res.json(game);
    })
    .catch((err) => {
      res.status(500).send(err); //handle error
    })
})

// upload new game
router.post("/upload", verifyToken, upload.single("image"), uploadGameValidator, validate, async (req, res) => {

  // validator for image.
  if (!req.file) {
    return res.status(400).json({ msg: "Image is required" });
  }

  const { name, description, price, genre, platform } = req.body;
  const image = req.file.filename;
  const developer = req.user;

  // create new game instance
  const newGame = new Game({
    name,
    description,
    price,
    image,
    genre,
    developer,
    platform
  });

  try {
    // Save game to database
    const savedGame = await newGame.save();
    console.log("Game saved successfully");

    // Add new game id to user's uploaded games
    const username = req.user;
    const user = await User.findOne({ username });
    user.uploadedGame.push(savedGame._id);
    await user.save();

    res.status(201).json(savedGame); // Send the saved game response

  } catch (err) {
    console.error("Error:", err);
    res.status(400).send(err);
  }
});

// Route to fetch new releases
router.get("/new-releases", async (req, res) => {
  try {
    const newReleases = await Game.find()
      .sort({ releaseDate: -1 }) // Sort by most recent release
      .limit(6); // Limit to the latest 6 releases
    res.json(newReleases);
  } catch (error) {
    res.status(500).json({ error: "Error fetching new releases" });
  }
});

// Route to fetch top-ranked games
router.get("/top-ranked", async (req, res) => {
  try {
    const topRankedGames = await Game.find()
      .sort({ rating: -1 }) // Sort by highest rating
      .limit(3); // Limit to top 3 games
    res.json(topRankedGames);
  } catch (error) {
    res.status(500).json({ error: "Error fetching top-ranked games" });
  }
});

// route to filter the game

router.get("/filter", (req, res) => {
  let filters = {}; // Create an empty object to later append any new responses

  // Check for price, genre, releasedate, platform
  if (req.query.price) {
    if (req.query.rng == "lte") {
      filters.price = { "$lt": parseFloat(req.query.price) }
    }
    else if (req.query.rng == "gte") {
      filters.price = { "$gt": parseFloat(req.query.price) }
    }
  }
  if (req.query.genre) {
    filters.genre = { "$all": JSON.parse(req.query.genre) };
  }
  if (req.query.releaseDate) {
    switch (req.query.releaseDate) {
      case "last_year":
        filters.releasedate = { "$gte": new Date(Date.now() - 31536000000) };
        break;
      case "last_month":
        filters.releasedate = { "$gte": new Date(Date.now() - 2592000000) };
        break;
      default:
        filters.releasedate = { "$gte": new Date(req.query.releaseDate) };
    }
  }
  if (req.query.platform) {
    filters.platform = { "$all": JSON.parse(req.query.platform) };
  }

  Game.find(filters)
    .then((games) => {
      res.json(games); // Return fetched game
    })
    .catch((err) => {
      res.status(500).send(err); // Handle error
    });

})

// route to update the game
router.put("/update/:id", verifyToken, upload.single("image"), uploadGameValidator, validate, async (req, res) => {
  const username = req.user;

  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).send({ message: "Game not found" });
    }

    if (game.developer === username || username === 'admin') {

      // Update game details from the request body
      game.name = req.body.name;
      game.description = req.body.description;
      game.genre = req.body.genre;
      game.price = req.body.price;
      game.platform = req.body.platform;

      // If a new image is uploaded, delete the old image
      if (req.file) {
        // Delete the old image from the server
        const oldImagePath = path.join(__dirname, "../data/img", game.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
          }
        });

        // Update the game with the new image
        game.image = req.file.filename;
      }

      // Save the updated game
      await game.save();
      res.json(game);
    } else {
      res.status(403).send({ message: "You do not have permission to edit this game" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

// route to delete game
router.delete("/delete/:id", verifyToken, async (req, res) => {
  const username = req.user;

  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).send({ message: "Game not found" });
    }

    if (game.developer === username || username === 'admin') {
      // If the game has an image, delete it from the server
      if (game.image) {
        const imagePath = path.join(__dirname, "../data/img", game.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }

      // Delete the game from the database
      await Game.findByIdAndDelete(req.params.id);

      // Delete the game from user uploaded
      const user = await User.findOne({ username });
      user.uploadedGame.pull(req.params.id);
      await user.save();

      res.json({ message: "Game deleted successfully" });
    } else {
      res.status(403).send({ message: "You do not have permission to delete this game" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});


module.exports = router;