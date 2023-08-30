require("dotenv").config();

const bcrypt = require("bcrypt");
const uuid = require("uuid");

const db = require("../database/models");
const mailService = require("../mailservice/MailService");

const handleNewUser = async (req, res) => {
  const { login, email, password } = req.body;

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
    const activationLink = uuid.v4();
    const newUser = await db.user.create({
      login,
      password: hashPass,
      email,
      activationLink,
    });

    const roleUser = await db.role.create({
      userId: newUser.id,
    });

    await mailService.sendActivationMail(
      email,
      `http://localhost:3000/activate/${activationLink}`
    );

    return res.status(201).json({ "message": "Регистрация прошла успешно!" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const activateUser = async (req, res) => {
  try {
    const activationLink = req.params.link;

    const user = await db.user.findOne({
      where: {
        activationLink,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Некорректная ссылка активации" });
    }

    user.isActivated = true;
    await user.save();

    return res.status(201).json({ message: "accaunt activationed" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

module.exports = { handleNewUser, activateUser };
