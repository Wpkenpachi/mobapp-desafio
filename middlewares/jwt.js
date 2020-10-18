const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next){
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : false;
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      req.userId = decoded.id;
      next();
    });
}

module.exports = verifyJWT;