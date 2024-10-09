const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const fs = require("fs")
const path = require("path")
const fetch_router = require("./routers/fetch_router");
const cors = require("cors");

// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/fetch", fetch_router);
app.use('/img', express.static(path.join(__dirname, 'data/img')));

// routes
app.get("/", (req, res) => {
  res.send("Welcome to our server")
})

app.get('/games', (req, res) => {
  // Read gamedata.json file
  fs.readFile(path.join(__dirname, 'data/gamedata.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading gamedata.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Parse the JSON data and send it back
    res.json(JSON.parse(data));
  });
});

// handle login

app.post("/login", (req, res) => {
  const { email, password} = req.body;
  console.log(email + " " + password);

})

// handle register

app.post("/register", (req, res) => {
  const { email, password} = req.body;
  console.log(email + " " + password);

})

//handle search using query

app.get("/search", (req, res) => {
  console.log(req.query)
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});


app.use("", (req, res) => {
  res.status(404).send("Page not found");
});

