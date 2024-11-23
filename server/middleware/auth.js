const User = require("../models/user")

const auth = (req, res, next) => {
    if (req.session && req.session.user) {
        User.findOne({ _id: req.session.user._id })
            .then(user_account => {
                if (!user_account) {
                    return res.send("No account found")
                }

                if (user_account.priv >= 2) {
                    next();
                }
                else {
                    return res.send("You don't have permission to access this page")
                }
            })
    }
    return res.status(401).json({ err: "Not Important Enough" })
}

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

    if (!token) {
        return res.status(401).json({ message: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach decoded user info to the request object
        next(); // Continue to the next middleware/route handler
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};


module.exports = {auth, verifyToken};