const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Game = require('../models/game');
const Order = require('../models/order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidator, loginValidator, validate } = require('../middleware/validator')

// route to handle register new user
router.post("/register", registerValidator, validate, (req, res) => {
    const { username, email, password } = req.body;
    bcrypt
        .genSalt(10)
        .then(salt => {
            return bcrypt.hash(password, salt)
        })
        .then((hashedPassword) => {
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });
            return newUser.save();
        })
        .then((result) => {
            res.status(201).json({ message: "Account Created" });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send("Error registering user");
        });
})

router.post("/login", loginValidator, validate, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) { //check if username existed
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (!bcrypt.compare(password, user.password)) { // check password
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET,
            { expiresIn: '1h' } // token expire in 1 hr
        );

        return res.status(200).json({
            result: "correct",
            token: token,
            username: user.username
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Route to fetch user details exclude password from userdata.json
router.get('/user/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userData = user.toJSON();
        delete userData.password;
        res.json(userData);
    } catch (err) {
        console.log(error)
        res.status(500).json({ error: "Error fetching user details" });
    }

});

// Router to add game to user cart
router.post('/cart', async (req, res) => {
    try {
        const { id, username } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const game = await Game.findOne({ _id: id });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        const cart = user.cart;
        if (cart.includes(id)) {
            return res.status(400).json({ message: 'Game already in cart' });
        }
        cart.push(id);
        user.cart = cart;
        await user.save();
        res.json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error adding game to cart" });
    }
});

// Router to remove game from user cart
router.delete('/cart/:gameId/:username', async (req, res) => {
    try {
        const { gameId, username } = req.params;

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the index of the game in the user's cart
        const cartItemIndex = user.cart.findIndex(item => item._id.equals(gameId));

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Game not found in cart' });
        }

        // Remove the item from the cart
        user.cart.splice(cartItemIndex, 1);

        // Save the updated user document
        await user.save();

        // Respond with the updated user data
        res.json({ message: 'Game removed from cart', cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing game from cart' });
    }
});

// Router to checkout (move from cart to gamesOwn) and add order item to database
router.post('/checkout', async (req, res) => {
    try {
        const username = req.body.username;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const cart = user.cart;
        if (cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const gamesOwn = user.gamesOwn;
        const items = [];
        let totalPrice = 0;  // Total price should be a variable, not constant

        for (const gameId of cart) {
            const game = await Game.findOne({ _id: gameId });

            if (!game) {
                return res.status(404).json({ message: 'Game not found' });
            }

            const orderItem = {
                game: gameId,
                quantity: 1,
                price: game.price
            };
            items.push(orderItem);
            totalPrice += game.price;  // Add game price to the total
        }

        const newOrder = new Order({
            user: user._id,
            items: items,
            totalAmount: totalPrice,
            status: 'Completed'
        });

        await newOrder.save();

        // Update user's gamesOwn and cart
        user.gamesOwn = [...new Set([...gamesOwn, ...cart])];  // Avoid duplicate entries in gamesOwn
        user.cart = [];  // Empty the cart after checkout
        await user.save();

        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error checking out" });
    }
});

// Route to add / remove wishlist to user
router.post('/wishlist', async (req, res) => {
    try {
        const { gameId, username, action } = req.body;

        // Validate action
        if (!['add', 'remove'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Use "add" or "remove".' });
        }

        const user = await User.findOne({ username: username });

        if (action === 'add') {
            if (user.wishList.includes(gameId) || user.gamesOwn.includes(gameId)) {
                return res.status(400).json({ message: 'Game already in wishlist' });
            }
            user.wishList.push(gameId);
        } else if (action === 'remove') {
            user.wishList = user.wishList.filter(id => !id.equals(gameId));
        }
        await user.save();
        res.json({ message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding to wishlist" });
    }
});



module.exports = router;