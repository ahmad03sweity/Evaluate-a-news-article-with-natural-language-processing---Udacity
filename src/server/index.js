const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { analyze } = require("./analyse");

const app = express();
const port = 8000;

// Load environment variables from .env file
dotenv.config();

// Middleware to enable CORS
app.use(cors());

// Middleware to serve static files from 'dist' directory
app.use(express.static('dist'));

// Middleware to parse JSON bodies
app.use(express.json());

const MEAN_CLOUD_API_KEY = process.env.API_KEY;

// Route to render the index.html file
app.get('/', function (req, res) {
    res.render("index.html");
});

// Route to handle POST requests for analysis
app.post("/", async (req, res) => {
    // 1. GET the url from the request body
    const url = req.body.URI;

    // 2. Fetch Data from API by sending the url and the key
    const Analyze = await analyze(url, MEAN_CLOUD_API_KEY);
    const { code, msg, sample } = Analyze;

    // Send errors if result was wrong
    if (code == 212) {
        return res.send({ msg: msg, code: code });
    } else if (code == 100) {
        return res.send({ msg: msg, code: code });
    }

    // Send the analysis result
    return res.send({ sample: sample, code: code });
});

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server is now listening on port ${port}`));