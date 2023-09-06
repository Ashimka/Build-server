const db = require("../database/models");
const dataOptions = require("../config/dataOptions");

const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.id;
    const postId = req.params.id;

    const date = new Intl.DateTimeFormat("ru", dataOptions).format(new Date());

    const newComment = await db.comment.create({
      text,
      userId,
      postId,
      date,
    });

    return res.status(201).json({ newComment });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Зарегистрируйтесьб чтобы оставить комментарий" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;

    const comment = await db.comment.findOne({
      where: { id },
    });

    if (!comment) {
      return res.json({ message: "Комментарий не найден" });
    }

    const result = await db.comment.destroy({
      where: { id },
    });

    res.json({ message: "Комментарий удален" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

module.exports = { createComment, deleteComment };
