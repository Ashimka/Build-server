require("dotenv").config();

const jwt = require("jsonwebtoken");

const db = require("../database/models");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refresh_jwt) {
    return res.status(401).json({ "message": "Не авторизован!" });
  }

  const refreshToken = cookies.refresh_jwt;
  const foundUser = await db.user.findOne({
    where: { refreshToken },
  });

  if (!foundUser) {
    return res.status(403).json({ "message": "Нет авторизации1" });
  }

  //   проверка jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      if (error || foundUser.login !== decoded.login) {
        return res.status(403).json({ "message": "Нет авторизации2" });
      }

      const roleUser = await db.role.findOne({
        where: { "userId": foundUser.id },
      });

      let roles = [];

      roles.push(roleUser.user);

      if (roleUser.admin !== null) {
        roles.push(roleUser.admin);
      }

      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "login": decoded.login,
            "id": decoded.id,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "25m" }
      );
      res.status(200).json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
