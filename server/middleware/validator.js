const { body, validationResult } = require("express-validator");
const path = require("path")
const fs = require("fs");

// rules for user register
const registerValidator = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please Enter a valid Email Adress"),
    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 6 })
        .withMessage("Password should be atleast 6 characters"),
];

// rule for login
const loginValidator = [
    body("username").notEmpty().withMessage("Please enter username"),
    body("password").notEmpty().withMessage("Please enter password")
];

// rule for upload game
const uploadGameValidator = [
    body("name").notEmpty().withMessage("Name is required"),

    body("description").notEmpty().withMessage("Description is required"),

    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ gt: 0 }).withMessage('Price must be more than 0'),

    body('genre')
        .isArray({ min: 1 }).withMessage('At least one genre is required.')
        .custom((value) => value.every(v => typeof v === 'string'))
        .withMessage('Genres must be an array of strings.'),

    body('platform')
        .isArray({ min: 1 }).withMessage('At least one platform is required.')
        .custom((value) => value.every(v => typeof v === 'string'))
        .withMessage('Platforms must be an array of strings.'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) { // if error remove the file uploadeed
            fs.unlink(path.join(__dirname, `../data/img/${req.file.filename}`), (err) => {
                if (err) console.error("Failed to remove file:", err);
            })};
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { registerValidator, loginValidator, uploadGameValidator, validate };