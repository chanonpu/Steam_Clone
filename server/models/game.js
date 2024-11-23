const mongoose = require("mongoose");

// Define the schema
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  genre: [
    {
      type: String,
      required: true,
    },
  ],
  releaseDate: {
    type: Date,
    default: Date.now
  },
  developer: {
    type: String,
    required: true,
  },
  platform: [
    {
      type: String,
      required: true,
    },
  ]
});

// Create the model
const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);
module.exports = Game;