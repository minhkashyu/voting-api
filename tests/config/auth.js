import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

import user from './user';

export default {
    loginAsUser: (app, user) => {
        return chai.request(app)
            .post('/api/auth/login')
            .send(user);
    },
    loginAsRegisteredUser: (app) => {
        return chai.request(app)
            .post('/api/auth/login')
            .send(user.registeredUser());
    },
    loginAsDifferentUser: (app) => {
        return chai.request(app)
            .post('/api/auth/login')
            .send(user.differentUser());
    }
};