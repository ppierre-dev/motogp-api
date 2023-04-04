// Imports
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import routes
const indexRouter = require('./routes/index');

// Define the Express app
const app = express();

dotenv.config(); // Config variables from .env file

app.use(cors()); // Allow cross-origin requests
app.use(logger('dev')); // Log requests to API using morgan
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.use('/', indexRouter); // Mount the root router

module.exports = app;
