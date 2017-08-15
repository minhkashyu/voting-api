export default {
    // Secret key for JWT signing and encryption
    secret: process.env.JWT,
    // Database connection information
    database: process.env.NODE_ENV !== 'test' ? process.env.MONGO_URI : process.env.MONGO_TEST_URI,
    // Setting port for server
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL
};