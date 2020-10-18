const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Parse = require('parse/node');
require('dotenv').config();
const should = chai.should();

// Variables
chai.use(chaiHttp);
const salt = 10;
const http = chai.request(process.env.API_URL);

describe("Authentication", () => {
    Parse.initialize(process.env.APPLICATION_ID, null, process.env.MASTER_KEY);
    Parse.serverURL = process.env.SERVER_URL;
    const UserModel = Parse.Object.extend("user");
    const userObject = new UserModel();
    const user = {
        username: "wesleyx@gmail.com",
        password: "123"
    };

    before(async () => {
        let query = new Parse.Query(UserModel);
        const password = await bcrypt.hash(user.password, bcrypt.genSaltSync(salt));
        query = query.equalTo("username", user.username);
        const _user = await query.first();
        if (!_user) {
            await userObject.save({
                username: user.username,
                password
            });
        };
    });

    it("/GET Auth", (done) => {
        http
        .post('/auth')
        .send(user)
        .end((err, res) => {
            res.body.should.have.property('auth');
            res.body.should.have.property('token');
            const isValidToken = jwt.verify(res.body.token, process.env.SECRET);
            chai.assert(isValidToken, true);
            done();
        });
    });

    after(async () => {
        const promises = [];
        let query = new Parse.Query(UserModel);
        const userObject = await query.find();
        userObject.forEach(_user => {
            promises.push(_user.destroy());
        });
        await Promise.all(promises);
    });
});