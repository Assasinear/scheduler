const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        req.user = jwt.verify(token, 'your_jwt_secret');
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;