require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../database/models");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ "message": "Неверный логин или пароль" });
  }

  const foundUser = await db.user.findOne({ where: { email } });
  if (!foundUser) {
    return res.status(401).json({ "message": "Неверный логин или пароль" });
  }

  //   проверка пароля
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roleUser = await db.role.findOne({
      where: { "userId": foundUser.id },
    });

    let roles = [];

    roles.push(roleUser.user);

    if (roleUser.admin !== null) {
      roles.push(roleUser.admin);
    }

    //  создание JWT
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "email": foundUser.email,
          "id": foundUser.id,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "25m" }
    );

    const refreshToken = jwt.sign(
      { "email": foundUser.email, "id": foundUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    //  Сохранение refreshToken текущим пользователем
    const result = await db.user.findOne({
      where: { id: foundUser.id },
    });
    result.refreshToken = refreshToken;
    await result.save();

    //  Создание и сохранение refreshToken в cookie добавить secure: true,

    res.cookie("refresh_jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    console.log("refreshToken", refreshToken);

    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ "message": "Неверный логин или пароль" });
  }
};

module.exports = { handleLogin };
