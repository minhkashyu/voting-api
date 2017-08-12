module.exports = {
    registeredUser: () => {
        return {
            "role": "Member",
            "local": {
                "firstName": "Local",
                "lastName": "Test",
                "email": "localtest@hotmail.com",
                "password": "111111"
            }
        };
    },
    differentUser: () => {
        return {
            "role": "Member",
            "local": {
                "firstName": "Different",
                "lastName": "User",
                "email": "differentuser@yahoo.com",
                "password": "$2a$08$ZRavHPWsFszTTfl1Klplxew92O.vTj1KPAgiZgcgqjzUU3R5U4tWO"
            }
        };
    }
};