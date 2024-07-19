
const jwt = require('jsonwebtoken');

const protectedRoute = (req, res, next) => {
    // Get the token from cookies or headers
    const token = req.cookies.token || req.headers['authorization'];
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Authorization failed: Token missing' });
    }

    // Verify the token
    jwt.verify(token, 'Hello', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Authorization failed: Invalid token' });
        }

        // Token is valid, attach decoded payload to request object
        req.user = decoded;
        next();
    });
};

module.exports = protectedRoute;
