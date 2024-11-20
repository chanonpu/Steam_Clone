require('dotenv').config();
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const path = require("path")
const cors = require("cors");

const game_router = require("./routers/game_router");
const user_router = require("./routers/user_router");

// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//mongoose
// adding our mongoDB database
const mongoose = require("mongoose"); // importing the dependancy
mongoose.connect(process.env.mongoDB); // establishing a connection
const db = mongoose.connection; // saving the databse usecase into a variable

db.once("open", () => {
  // Check connection
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  // Check for DB errors
  console.log("DB Error");
});

// routes
app.use("/game", game_router);
app.use("/user", user_router);
app.use('/img', express.static(path.join(__dirname, 'data/img')));

app.get("/", (req, res) => {
  res.send("Welcome to our server")
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});


app.use("", (req, res) => {
  res.status(404).send("Page not found");
});

