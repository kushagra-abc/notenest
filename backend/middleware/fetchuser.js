const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

const fetchuser = (req, res, next) => {
    // Get the JWT from the request header
    const token = req.header('auth-token');

    // Check whether the token exists
    if (!token) {
        return res.status(401).send({
            error: "Please authenticate using a valid token"
        });
    }

    try {
        // Verify the JWT and extract user information
        const data = jwt.verify(token, JWT_SECRET);

        // Attach user information to the request
        req.user = data.user;

        next();

    } catch (error) {
        return res.status(401).send({
            error: "Please authenticate using a valid token"
        });
    }
};

module.exports = fetchuser;