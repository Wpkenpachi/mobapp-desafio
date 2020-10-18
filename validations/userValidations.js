const { check } = require('express-validator');

function userValidation() {
    return [
        check("username").isEmail().not().isEmpty().trim(),
        check("password").isString().not().isEmpty().trim()
    ]
}

module.exports = { userValidation };