const express = require("express");
const router = express.Router();
const userController = require('../controller/user_controller');
const { registerValidator, loginValidator, validate } = require('../middleware/validator')
const { verifyToken } = require('../middleware/auth')

// route to handle register new user
router.post("/register", registerValidator, validate, userController.registerUser);

// route to handle login
router.post("/login", loginValidator, validate, userController.login);

// Route to fetch user details exclude password from userdata.json
router.get('/user', verifyToken, userController.fetchUserDetails);

// Router to add game to user cart
router.post('/cart', verifyToken, userController.addGameToCart);

// Router to remove game from user cart
router.delete('/cart/:gameId/', verifyToken, userController.removeFromCart);

// Router to checkout (move from cart to gamesOwn) and add order item to database
router.post('/checkout', verifyToken, userController.checkout);

// Route to add / remove wishlist to user
router.post('/wishlist', verifyToken, userController.toggleWishlist);

module.exports = router;