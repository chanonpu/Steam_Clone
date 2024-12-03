const Game = require("../models/game");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth')

// register new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if existed
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
    }


    // Hash the password
    bcrypt
        .genSalt(10)
        .then(salt => {
            return bcrypt.hash(password, salt)
        })
        .then(async (hashedPassword) => {
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });
            return await newUser.save();
        })
        .then((result) => {
            res.status(201).json({ message: "Account Created" });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send("Error registering user");
        });
};

// login
const login = async (req, res) => {
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
        const token = generateToken(user);

        return res.status(200).json({
            result: "correct",
            token: token,
            username: user.username
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// fetch user details exclude password from userdata.json
const fetchUserDetails = async (req, res) => {
    try {
        const username = req.user;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userData = user.toJSON();
        delete userData.password; //remove password from the data
        res.json(userData);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error fetching user details" });
    }
};

// add game to user cart
const addGameToCart = async (req, res) => {
    try {
        const id = req.body.id;
        const username = req.user;
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
};

// remove game from user cart
const removeFromCart = async (req, res) => {
    try {
        const { gameId } = req.params;
        const username = req.user;

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
};

// checkout and add order item to database
const checkout = async (req, res) => {
    try {
        const username = req.user;
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
        let totalPrice = 0;

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
};

// add / remove wishlist to user
const toggleWishlist = async (req, res) => {
    try {
        const { gameId, action } = req.body;
        const username = req.user;

        // Validate action
        if (!['add', 'remove'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Use "add" or "remove".' });
        }

        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // add to wishlist
        if (action === 'add') {
            if (user.wishList.includes(gameId) || user.gamesOwn.includes(gameId)) {
                return res.status(400).json({ message: 'Game already in wishlist' });
            }
            user.wishList.push(gameId);
        } else if (action === 'remove') {
            // remove from wishlist
            user.wishList = user.wishList.filter(id => !id.equals(gameId));
        }
        await user.save();
        res.json({ message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding to wishlist" });
    }
};

module.exports = {
    registerUser,
    login,
    fetchUserDetails,
    addGameToCart,
    removeFromCart,
    checkout,
    toggleWishlist
};