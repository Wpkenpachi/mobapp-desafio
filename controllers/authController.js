const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { getUser }  = require('../repositories/userRepository');

async function auth(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = await getUser(req.body);

    if (user) {
        token = jwt.sign({ id: user.objectId }, process.env.SECRET, {});
        return res.json({ auth: true, token: token });
    }
    res.status(500).json({message: 'Login inválido!'});
}

module.exports = { auth };