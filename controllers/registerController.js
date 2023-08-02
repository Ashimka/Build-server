const bcrypt = require("bcrypt");

const db = require("../database/models");

const handleNewUser = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ "message": "Пользователь или пароль не найдены" });
  }
  //   Проверка на дубликат
  const duplicate = await db.user.findOne({ where: { email } });
  if (duplicate) {
    return res
      .status(409)
      .json({ "message": "Пользователь с таким email уже существует" });
  }

  try {
    // hash pass
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      email,
      password: hashPass,
      fullName,
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
