import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
require('dotenv').config({ silent: true });

let app = express();
const config = require('./config/main').default;
const router = require('./routes/index').default;

// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useMongoClient: true
})
.then(() => {
    console.log('Mongoose default connection is open to ' + config.database);
})
.catch((error) => {
    console.log('error connecting to db: ' + error);
});

// Setting up basic middleware for all Express requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies to get info from POST and/or URL parameters
app.use(bodyParser.json()); // Send JSON responses
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev')); // Log requests to API using morgan
}

//Enable CORS from client-side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, Media');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Import routes to be served
router(app);

let server = app.listen(config.port, err => {
    if (err) {
        return console.error(err);
    }

    console.log('The server is listening on port %s', config.port);
});

module.exports = {
    server: server
};