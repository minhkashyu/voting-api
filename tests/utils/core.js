module.exports = {
    path: (path, filter) => {
        path = '/api' + path;
        if (filter) {
            path += `&${filter}`;
        }
        return path;
    }
};