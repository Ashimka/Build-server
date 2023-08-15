const bcrypt = require("bcrypt");

const db = require("../database/models");

const handleNewUser = async (req, res) => {
  const { email, password, login } = req.body;

  if (!login || !password) {
    return res
      .status(400)
      .json({ "message": "Пользователь или пароль не найдены" });
  }
  //   Проверка на дубликат
  const duplicateLogin = await db.user.findOne({ where: { login } });
  if (duplicateLogin) {
    return res
      .status(409)
      .json({ "message": "Пользователь с таким логином уже существует" });
  }
  const duplicateEmail = await db.user.findOne({ where: { email } });
  if (duplicateEmail) {
    return res
      .status(409)
      .json({ "message": "Пользователь с таким email уже существует" });
  }

  try {
    // hash pass
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      login,
      password: hashPass,
      email,
    });
    const roleUser = await db.role.create({
      userId: newUser.id,
    });

    // console.log(newUser.toJSON(), roleUser.toJSON());
    return res.status(201).json({ "message": "Регистрация прошла успешно!" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

module.exports = { handleNewUser };
