export default {
    secret: process.env.JWT,
    database: process.env.NODE_ENV !== 'test' ? process.env.MONGO_URI : process.env.MONGO_TEST_URI,
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL
};