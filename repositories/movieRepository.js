const Parse = require('parse/node');
Parse.initialize(process.env.APPLICATION_ID, null, process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;
const MovieModel = Parse.Object.extend("movie");

async function getMovies() {
    const movies = new MovieModel();
    const query = new Parse.Query(movies);
    return await query.find();
}

async function queryMovie(field) {
    const { _title, _release_date } = field;
    const query = new Parse.Query(MovieModel);
    const movies = await query.find();
    return movies.filter((model) => {
        if (model.get('title') == _title || model.get('release_date') == _release_date) {
            return {title: model.get('title'), release_date: model.get('release_date')};
        }
    });
}

async function storeMovies(moviesData) {
    const promises = [];
    moviesData.forEach( movieData => {
        const movie = new MovieModel();
        const storeMoviePromise = movie.save(movieData);
        promises.push(storeMoviePromise);
    });

    return Promise.all(promises);
}

async function updateMovieData(movieId, movieData) {
    const query = new Parse.Query(MovieModel);
    const movie = await query.get(movieId);
    return await movie.save(movieData);
}

module.exports = { getMovies, storeMovies, updateMovieData, queryMovie };