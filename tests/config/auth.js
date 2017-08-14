import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

export default {
    loginAsUser: (app, user) => {
        return chai.request(app)
            .post('/api/auth/login')
            .send(user);
    }
};