const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const Parse = require('parse/node');
require('dotenv').config();

// Variables
chai.use(chaiHttp);
const should = chai.should();
const http = chai.request(process.env.API_URL);

describe("User Endpoints", () => {
    Parse.initialize(process.env.APPLICATION_ID, null, process.env.MASTER_KEY);
    Parse.serverURL = process.env.SERVER_URL;
    const UserModel = Parse.Object.extend("user");
    const user = {
        username: "wesleyy@gmail.com",
        password: "123"
    };

    it("/POST storeUser", (done) => {
        http
        .post('/store/user')
        .send(user)
        .end((err, res) => {
            res.body.should.have.property('user');
            res.body.should.have.property('token');
            done();
        });
    });

    after(async () => {
        const promises = [];
        let query = new Parse.Query(UserModel);
        const userObject = await query.find();
        userObject.forEach((_user) => {
            promises.push(_user.destroy());
        })
        await Promise.all(promises);
    });
});