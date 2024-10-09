const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to the data and image folders
const gameDataPath = path.join(__dirname, '../data', 'gamedata.json');
let gameData = JSON.parse(fs.readFileSync(gameDataPath, 'utf8'));
const imagePath = path.join(__dirname, '../data', 'img');
const userDataPath = path.join(__dirname, '../data', 'userdata.json');

// Route to fetch game details from gamedata.json
router.get('/games/:id', (req, res) => {
  fs.readFile(gameDataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Could not read game data' });
      return;
    }

    const games = JSON.parse(data);
    const game = games.find(g => g.id === req.params.id);

    if (game) {
      res.json(game);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  });
});

// POST to fetch game details by IDs
router.post('/games', (req,res) => {
  const {gameIds} = req.body;
  console.log(gameData);
  const games = gameData.filter(game => gameIds.includes(game.id));
  console.log(games);
  res.json(games);
})

// Route to serve game images using res.sendFile
router.get('/image/:filename', (req, res) => {
  const imageFile = path.join(imagePath, req.params.filename);
  
  // Check if the image exists and send the file
  if (fs.existsSync(imageFile)) {
    res.sendFile(imageFile);
  } else {
    res.status(404).send('Image not found');
  }
});

// Route to fetch user details from userdata.json
router.get('/user/:id', (req, res) => {
  fs.readFile(userDataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Could not read user data' });
      return;
    }

    const users = JSON.parse(data);
    const user = users.find(user => user.id === req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

module.exports = router;