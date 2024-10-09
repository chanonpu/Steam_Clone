const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Path to the data and image folders
const gameDataPath = path.join(__dirname, 'data', 'gamedata.json');
const imagePath = path.join(__dirname, 'data', 'img');

// Route to fetch game details from gamedata.json
app.get('/api/games/:id', (req, res) => {
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

// Route to serve game images using res.sendFile
app.get('/image/:filename', (req, res) => {
  const imageFile = path.join(imagePath, req.params.filename);
  
  // Check if the image exists and send the file
  if (fs.existsSync(imageFile)) {
    res.sendFile(imageFile);
  } else {
    res.status(404).send('Image not found');
  }
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
