// Example for User
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  gamesOwn: [ // Reference to Game model
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }
  ],
  wishList: [ // Reference to Game model
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }
  ],
  cart: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }
  ],
  uploadedGame: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }
  ]
});

const User = mongoose.models.User || mongoose.model('user', userSchema);
module.exports = User;