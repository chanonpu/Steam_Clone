const Game = require("../models/game");
const Image = require("../models/image");
const User = require('../models/user');

// fetch all game
const getAllGame = async (req, res) => {
    try {
        // Query the Game collection to retrieve all games
        const games = await Game.find({});
        res.json(games);
    } catch (err) {
        console.error('Error retrieving games:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// fetch an image
const getImage = async (req, res) => {
    const imgId = req.query.name;

    if (!imgId) {
        return res.status(400).json({ error: "Image name is required." });
    }

    Image.findById(imgId)
        .then((image) => {
            if (!image) {
                return res.status(404).json({ error: "Image not found." });
            }

            res.set('Content-Type', image.contentType);
            res.set('Content-Disposition', `inline; filename="${image.filename}"`);
            res.send(image.imageBuffer);
        })
        .catch((error) => {
            console.error("Error fetching image:", error);
            res.status(500).json({ error: "Error fetching image." });
        });
};

// fetch single game details by ID params
const getOneGameByID = async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findOne({ _id: gameId })
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: 'Could not fetch game data' });
    }
};

// fetch multiple game details by ID
const getMultipleGamesByIDs = async (req, res) => {
    const { gameIds } = req.body;
    const games = await Game.find({ _id: { $in: gameIds } });
    res.json(games);
};

// fetch new releases
const getNewReleaseGames = async (req, res) => {
    try {
        const newReleases = await Game.find()
            .sort({ releaseDate: -1 }) // Sort by most recent release
            .limit(6); // Limit to the latest 6 releases
        res.json(newReleases);
    } catch (error) {
        res.status(500).json({ error: "Error fetching new releases" });
    }
};

// fetch top-ranked games
const getTopRankedGames = async (req, res) => {
    try {
        const topRankedGames = await Game.find()
            .sort({ rating: -1 }) // Sort by highest rating
            .limit(3); // Limit to top 3 games
        res.json(topRankedGames);
    } catch (error) {
        res.status(500).json({ error: "Error fetching top-ranked games" });
    }
};

//handle search using query
const searchGame = async (req, res) => {
    Game.find({ name: { $regex: req.query.name, $options: 'i' } })
        .then((game) => {
            res.json(game);
        })
        .catch((err) => {
            res.status(500).send(err); //handle error
        })
};

// filter the game
const filterGame = async (req, res) => {
    let filters = {}; // Create an empty object to later append any new responses

    // Check for price, genre, releasedate, platform
    if (req.query.price) {
        if (req.query.rng == "lte") {
            filters.price = { "$lt": parseFloat(req.query.price) }
        }
        else if (req.query.rng == "gte") {
            filters.price = { "$gt": parseFloat(req.query.price) }
        }
    }
    if (req.query.genre) {
        filters.genre = { "$all": JSON.parse(req.query.genre) };
    }
    if (req.query.releaseDate) {
        switch (req.query.releaseDate) {
            case "last_year":
                filters.releasedate = { "$gte": new Date(Date.now() - 31536000000) };
                break;
            case "last_month":
                filters.releasedate = { "$gte": new Date(Date.now() - 2592000000) };
                break;
            default:
                filters.releasedate = { "$gte": new Date(req.query.releaseDate) };
        }
    }
    if (req.query.platform) {
        filters.platform = { "$all": JSON.parse(req.query.platform) };
    }

    Game.find(filters)
        .then((games) => {
            res.json(games); // Return fetched game
        })
        .catch((err) => {
            res.status(500).send(err); // Handle error
        });

};

// upload game
const uploadGame = async (req, res) => {

    // Validator for image.
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const file = req.file;
    const newImage = new Image({
        filename: file.originalname,
        contentType: file.mimetype,
        imageBuffer: file.buffer,
    });

    try {
        // Save image to database
        const savedImage = await newImage.save();
        console.log("File uploaded successfully.");

        const { name, description, price, genre, platform } = req.body;
        const developer = req.user;

        // Create new game instance
        const newGame = new Game({
            name,
            description,
            price,
            image: savedImage._id,
            genre,
            developer,
            platform
        });

        // Save game to database
        const savedGame = await newGame.save();
        console.log("Game saved successfully");

        // Add new game id to user's uploaded games
        const username = req.user;
        const user = await User.findOne({ username });
        user.uploadedGame.push(savedGame._id);
        await user.save();

        res.status(201).json(savedGame); // Send the saved game response

    } catch (err) {
        console.error("Error:", err);
        // If there's an error, remove the uploaded image from the database
        if (req.file) {
            await Image.findOneAndDelete({ filename: req.file.originalname });
            console.log("Image removed due to error.");
        }
        res.status(400).send(err); // Send error response
    }
};

// update the game
const updateGame = async (req, res) => {
    const username = req.user;

    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).send({ message: "Game not found" });
        }

        if (game.developer === username || username === 'admin') {

            // Update game details from the request body
            game.name = req.body.name || game.name;
            game.description = req.body.description || game.description;
            game.genre = req.body.genre || game.genre;
            game.price = req.body.price || game.price;
            game.platform = req.body.platform || game.platform;

            // If a new image is uploaded, replace image with the new one
            if (req.file) {
                const file = req.file;
                const image = await Image.findById(game.image);
                if (image) {
                    image.filename = file.originalname;
                    image.contentType = file.mimetype;
                    image.imageBuffer = file.buffer;
                    image.uploadDate = Date.now();
                    await image.save();
                } else {
                    return res.status(400).send({ message: "Error fetching the image for update" });
                }
            }

            // Save the updated game
            await game.save();
            res.json(game);
        } else {
            res.status(403).send({ message: "You do not have permission to edit this game" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
};

// delete game
const deleteGame = async (req, res) => {
    const username = req.user;

    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).send({ message: "Game not found" });
        }

        if (game.developer === username || username === 'admin') {
            // If the game has an image, delete it from the server
            if (game.image) {
                await Image.findByIdAndDelete(game.image);
            }

            // Delete the game from the database
            await Game.findByIdAndDelete(req.params.id);

            // Delete the game from user uploaded
            const user = await User.findOne({ username });
            user.uploadedGame.pull(req.params.id);
            await user.save();

            res.json({ message: "Game deleted successfully" });
        } else {
            res.status(403).send({ message: "You do not have permission to delete this game" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
};

module.exports = {
    getAllGame,
    getImage,
    getOneGameByID,
    getMultipleGamesByIDs,
    getNewReleaseGames,
    getTopRankedGames,
    searchGame,
    filterGame,
    uploadGame,
    updateGame,
    deleteGame,
};