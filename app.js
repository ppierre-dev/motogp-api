// Imports
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Config variables from .env file

// Import routes
const indexRouter = require('./routes/index.js');
const pilotesRouter = require('./routes/pilotes.js');
const teamsRouter = require('./routes/teams.js');

// Define the Express app
const app = express();

// Connect to the MongoDB database
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(cors()); // Allow cross-origin requests
app.use(logger('dev')); // Log requests to API using morgan
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.use('/', indexRouter); // Mount the root router
app.use('/api/pilotes', pilotesRouter); // Mount the pilotes router
app.use('/api/teams', teamsRouter); // Mount the teams router

module.exports = app;
