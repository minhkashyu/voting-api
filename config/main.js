module.exports = {
    // Secret key for JWT signing and encryption
    secret: process.env.JWT,
    // Database connection information
    database: process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/voting-app-test' : process.env.MONGO_URI || 'mongodb://localhost:27017',
    // Setting port for server
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL
};