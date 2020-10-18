const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Parse = require('parse/node');
require('dotenv').config();

//Variables
const should = chai.should();
const salt = 10;
const http = chai.request(process.env.API_URL);
const moviesArr = [
    {
        title: "Um Sonho de Liberdade",
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg",
        release_date: "1994-03-17"
    },
    {
        title: "O Poderoso Chefão",
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY268_CR3,0,182,268_AL_.jpg",
        release_date: "1972-08-10"
    }
];

describe("Movie", () => {
    // Setup
    Parse.initialize(process.env.APPLICATION_ID, null, process.env.MASTER_KEY);
    Parse.serverURL = process.env.SERVER_URL;
    const MovieModel = Parse.Object.extend("movie");
    const UserModel = Parse.Object.extend("user");
    const userObject = new UserModel();

    // FakeMovies Array
    let movies = [];

    // Fake updatedMovie
    let updatedMovieId = null;

    // FakeUser
    const user = {
        username: "wesleyx@gmail.com",
        password: "123"
    };

    // Fake Token
    let token = "";

    before(async () => {
        // Feeding Databse with Movies
        const promises = [];
        moviesArr.forEach( movieData => {
            const movie = new MovieModel();
            const storeMoviePromise = movie.save(movieData);
            promises.push(storeMoviePromise);
        });
        movies = await Promise.all(promises);

        // Creating FakeUser if not exist
        let query = new Parse.Query(UserModel);
        const password = await bcrypt.hash(user.password, bcrypt.genSaltSync(salt));
        query = query.equalTo("username", user.username);
        const _user = await query.first();
        if (_user) return;
        const { objectId } = await userObject.save({
            username: user.username,
            password
        });

        token = jwt.sign({ id: objectId }, process.env.SECRET);
    });

    it("/GET List Movies", (done) => {
        http
        .get('/get/movies')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            // console.log(res.body, token);
            movies.push(res.body[0]);
            updatedMovieId = res.body[0].objectId;
            res.body.should.be.a('array');
            res.body.forEach((mv, i) => {
                chai.expect(res.body).to.have.nested.property(`[${i}].title`);
                chai.expect(res.body).to.have.nested.property(`[${i}].description`);
                chai.expect(res.body).to.have.nested.property(`[${i}].poster`);
                chai.expect(res.body).to.have.nested.property(`[${i}].release_date`);
            });
            done();
        });
    });

    it("/POST Store Movies", (done) => {
        const _movie = [{
            title: "Batman: O Cavaleiro das Trevas",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX182_CR0,0,182,268_AL_.jpg",
            release_date: "1994-03-17"
        }];
        http
        .post('/store/movies')
        .send(_movie)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            movies.push(res.body[0]);
            res.body.should.be.a('array');
            res.body.forEach((mv, i) => {
                chai.expect(res.body).to.have.nested.property(`[${i}].title`);
                chai.expect(res.body).to.have.nested.property(`[${i}].description`);
                chai.expect(res.body).to.have.nested.property(`[${i}].poster`);
                chai.expect(res.body).to.have.nested.property(`[${i}].release_date`);
            });
            done();
        });
    });

    it("/POST Update Movie", (done) => {
        http
        .post(`/update/movie/${updatedMovieId}`)
        .send({
            title: "The Dark Knight"
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.be.a('object');
            chai.expect(res.body).to.have.property('title');
            chai.expect(res.body).to.have.property('description');
            chai.expect(res.body).to.have.property('poster');
            chai.expect(res.body).to.have.property('release_date');
            done();
        });
    });

    it("/GET Search For Movies by ReleaseDate", (done) => {
        http
        .get('/fetch/movie?release_date=1994-03-17')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.be.a('array');
            res.body.forEach((mv, i) => {
                chai.expect(res.body).to.have.nested.property(`[${i}].objectId`);
                chai.expect(res.body).to.have.nested.property(`[${i}].title`);
                chai.expect(res.body).to.have.nested.property(`[${i}].description`);
                chai.expect(res.body).to.have.nested.property(`[${i}].poster`);
                chai.expect(res.body).to.have.nested.property(`[${i}].release_date`);
            });
            done();
        });
    });

    it("/GET Search For Movies by Title", (done) => {
        http
        .get('/fetch/movie?title=Um Sonho de Liberdade')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            res.body.should.be.a('array');
            res.body.forEach((mv, i) => {
                chai.expect(res.body).to.have.nested.property(`[${i}].objectId`);
                chai.expect(res.body).to.have.nested.property(`[${i}].title`);
                chai.expect(res.body).to.have.nested.property(`[${i}].description`);
                chai.expect(res.body).to.have.nested.property(`[${i}].poster`);
                chai.expect(res.body).to.have.nested.property(`[${i}].release_date`);
            });
            done();
        });
    });

    after(async () => {
        const promises = [];
        const queries = [];
        let query = new Parse.Query(MovieModel);
        const queryPromise = await query.find();
        queryPromise.forEach( _query => {
            queries.push(_query.destroy());
        });
        await Promise.all(queries);
    });
});