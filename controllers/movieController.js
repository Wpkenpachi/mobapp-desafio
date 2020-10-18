const { validationResult } = require('express-validator');
const { getMovies, storeMovies, updateMovieData, queryMovie } = require('../repositories/movieRepository');
const url = require('url');

async function listMovies(req, res) {
    const movies = await getMovies();
    res.json(movies);
}

async function createMovies(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const movies = Array.isArray(req.body) ? req.body : [];
    const resp = await storeMovies(movies);
    res.json(resp);
}

async function updateMovie(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newData = req.body ? req.body : {};
        const movieId = req.params['id'] ? req.params['id'] : false;
        const newMovie = await updateMovieData(movieId, newData);
        res.json(newMovie);
    } catch (error) {
        res.status(503).json(error);
    }
}

async function searchMovie(req, res) {
    const _title = req.query["title"] ? decodeURIComponent(req.query["title"]) : "";
    const _release_date = req.query["release_date"] ? decodeURIComponent(req.query["release_date"]) : "";
    const movies = await queryMovie({ _title, _release_date });
    res.json(movies);
}

module.exports = { listMovies, createMovies, updateMovie, searchMovie };