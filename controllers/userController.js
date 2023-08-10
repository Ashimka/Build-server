const db = require("../database/models/index.js");

const getMe = async (req, res) => {
  try {
    const userId = req.id;

    const user = await db.user.findOne({
      where: {
        id: userId,
      },
      attributes: ["id", "email", "fullName", "avatarURL", "createdAt"],
      include: [{ model: db.role, attributes: ["admin", "user"] }],
      include: [{ model: db.post, attributes: ["viewsCount"] }],
    });

    if (!user) {
      return res.json({
        message: "Такого пользователя не существует",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.json({ message: "Нет доступа" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await db.user.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const getAllPostsUser = async (req, res) => {
  try {
    const id = req.id;

    const posts = await db.post.findAll({
      where: { userId: id },
      include: [
        { model: db.user, attributes: ["fullName", "avatarURL"] },
        { model: db.tagPost, attributes: ["tags"] },
        { model: db.comment, attributes: ["text"] },
      ],
    });

    if (!posts.length) {
      return res.status(200).json({
        message: "У вас нет постов",
      });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

const userAvatarUpdate = async (req, res) => {
  try {
    const { avatarURL } = req.body;
    const userId = req.id;

    const user = await db.user.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.json({ message: "пользователь не найден" });
    }
    user.avatarURL = avatarURL;
    await user.save();

    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ "message": error.message });
  }
};

module.exports = {
  getMe,
  getAllUsers,
  getAllPostsUser,
  userAvatarUpdate,
};
