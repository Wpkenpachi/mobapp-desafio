const Route = require('express').Router();
// Middleware
const jwtMiddleware = require('./middlewares/jwt');

// Controllers
const { createMovies, listMovies, updateMovie, searchMovie } = require('./controllers/movieController');
const { auth, logout } = require('./controllers/authController');
const { createUser } = require('./controllers/userController');

// Validarions
const { storeMovieValidations, updateMovieValidations } = require("./validations/movieValidations");
const { userValidation } = require('./validations/userValidations');


// Routes
Route.post('/auth', userValidation(), auth);

Route.post('/store/user', userValidation(), createUser);

Route.post('/store/movies', jwtMiddleware, storeMovieValidations(), createMovies);

Route.get('/get/movies', jwtMiddleware, listMovies);

Route.post('/update/movie/:id', jwtMiddleware, updateMovieValidations(), updateMovie);

Route.get('/fetch/movie', jwtMiddleware, searchMovie);

module.exports = Route;