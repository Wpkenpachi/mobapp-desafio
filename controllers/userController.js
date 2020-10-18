const { validationResult } = require('express-validator');
const { storeUser, checkUserExists } = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

async function createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userExists = await checkUserExists(req.body);
    if (userExists) {
        return res.status(400).json({ errors: ["User already exists"] });
    }

    const user = await storeUser(req.body);
    const token = jwt.sign({ id: user.objectId }, process.env.SECRET, {});

    res.json({ user, token });
}

module.exports = { createUser };