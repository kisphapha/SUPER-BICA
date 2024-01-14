const express = require('express');
let tokenList = []

const verifyLoggedIn = (req, res, next) => {
    // Get the bearer token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authentication failed. Missing bearer token." });
    }
    // Verify the token using your preferred method (e.g., using jsonwebtoken library)
    verifiedToken = tokenList.filter(element => element.token == token)[0];
    if (!verifiedToken)
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
    verifiedToken = tokenList.filter(element => element.token == token)[0];
    if (!verifiedToken)
        return res.status(403).json({ message: "Authentication failed. Invalid bearer token." });
    if (verifiedToken.id != req.body.id && verifiedToken.id != req.params.id && verifiedToken.id != req.query.id)
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
    verifiedToken = tokenList.filter(element => element.token === token)[0];
    if (!verifiedToken)
        return res.status(403).json({ message: "Authentication failed. Invalid bearer token." });
    if (verifiedToken.role != "Admin" && verifiedToken.role != "Staff")
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
    verifiedToken = tokenList.filter(element => element.token === token)[0];
    if (!verifiedToken)
        return  res.status(403).json({ message: "Authentication failed. Invalid bearer token." });
    if (verifiedToken.role != "Admin")
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
    tokenList
}