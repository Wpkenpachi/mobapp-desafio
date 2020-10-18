const { body, param } = require('express-validator');

function storeMovieValidations() {
    return [
        body("*.title").isString().not().isEmpty().trim(),
        body("*.description").isString().not().isEmpty().trim(),
        body("*.poster").isString().not().isEmpty().trim(),
        body("*.release_date").isISO8601(),
    ]
}

function updateMovieValidations() {
    return [
        param("id").isString().not().isEmpty().trim(),
        body("title").optional().isString().not().isEmpty().trim(),
        body("description").optional().isString().not().isEmpty().trim(),
        body("poster").optional().isString().not().isEmpty().trim(),
        body("release_date").optional().isISO8601(),
    ]
}

module.exports = { storeMovieValidations, updateMovieValidations };