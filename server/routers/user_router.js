const express = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {registerValidator, loginValidator, validate} = require('../middleware/validator')

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

        return res.json({ result: "correct" });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Route to fetch user details from userdata.json
router.get('/user/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error fetching user details" });
    }
});

module.exports = router;