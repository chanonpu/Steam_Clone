const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id, username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};


// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded.username; // Attach decoded user info to the request object
        next(); // Continue to the next middleware/route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') { // check expired token
            return res.status(401).json({ message: "Token has expired" });
        }
        res.status(400).json({ message: "Invalid token" });
    }
};


module.exports = { generateToken, verifyToken };