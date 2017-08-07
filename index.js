import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
require('dotenv').config({ silent: true });

const app = express();
const config = require('./config/main');
const router = require('./routes/index');

// Database Connection
mongoose.connect(config.database, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies to get info from POST and/or URL parameters
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

//Enable CORS from client-side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Media');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Import routes to be served
router(app);

app.listen(config.port, err => {
    if (err) {
        return console.error(err);
    }
    console.log('The server is listening on ' + config.port + '...');
});
