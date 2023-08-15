const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ "message": "Не авторизован" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "invalid token" });
    }

    req.login = decoded.UserInfo.login;
    req.id = decoded.UserInfo.id;
    req.roles = decoded.UserInfo.roles;

    next();
  });
};

module.exports = verifyJWT;
