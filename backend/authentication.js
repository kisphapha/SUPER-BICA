const jwt = require("jsonwebtoken")

const verifyLoggedIn = (req, res, next) => {
    // Get the bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication failed. Missing bearer token." });
    }
    const user = jwt.decode(token);
    if (!user)
        return res.status(403).json({ message: "Authentication failed. Invalid bearer token." });
    next();
};
const verifyUserToken = (req, res, next) => {
    // Get the bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication failed. Missing bearer token." });
    }
    // Verify the token using your preferred method (e.g., using jsonwebtoken library)
    const user = jwt.decode(token);
    if (!user)
        return res.status(403).json({ message: "Authentication failed. Invalid bearer token." });
    if (user.id != req.body.id && user.id != req.params.id && user.id != req.query.id)
        return res.status(403).json({ message: "Authentication failed. Not the owner." });
    next();
};
const staffAuthenToken = (req, res, next) => {
    // Get the bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication failed. Missing bearer token." });
    }

    // Verify the token using your preferred method (e.g., using jsonwebtoken library)
    const user = jwt.decode(token);
    if (!user)
        return res.status(403).json({ message: "Authentication failed. Invalid bearer token." });
    if (user.role != "Admin" && user.role != "Staff")
        return res.status(403).json({ message: "Authentication failed. Do not have permission." });
    next();
}
const adminAuthenToken = (req, res, next) => {
    // Get the bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication failed. Missing bearer token." });
    }

    // Verify the token using your preferred method (e.g., using jsonwebtoken library)
    const user = jwt.decode(token);
    if (!user)
        return  res.status(403).json({ message: "Authentication failed. Invalid bearer token." });
    if (user.role != "Admin")
        return  res.status(403).json({ message: "Authentication failed. Do not have permission." });
    next();
}
const verifyServerKey = (req, res, next) => {
    // Get the bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication failed. Missing bearer token." });
    }
    if (token != process.env.SERVER_KEY)
        return res.status(403).json({ message: "Authentication failed. Do not have permission." });
    next();
};

module.exports = {
    verifyLoggedIn,
    verifyUserToken,
    adminAuthenToken,
    staffAuthenToken,
    verifyServerKey,
}