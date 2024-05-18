const jwt = require('jsonwebtoken');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;

    if (token) {
        jwt.verify(token, 'coderhouse', (err, decoded) => {
            if (err) {
                res.status(403).send('Token error. Access denied.');
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).send('Access denied. not authorized.');
                }
            }
        });
    } else {
        res.status(403).send('Access denied. ');
    }
};

module.exports = checkUserRole;