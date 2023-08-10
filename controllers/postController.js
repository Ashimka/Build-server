const { format } = require("date-fns");

const db = require("../database/models");

const createPost = async (req, res) => {
  try {
    const { title, text, imageURL, tags } = req.body;
    const date = `${format(new Date(), "dd-MM-yyyy\tHH:mm")}`;

    const newPost = await db.post.create({
      title,
      text,
      imageURL,
      userId: req.id,
      date,
    });

    const tagsPost = await db.tagPost.create({
      postId: newPost.id,
      tags,
    });

    return res.status(201).json({ newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "message": error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await db.post.findAll({
      include: [
        { model: db.user, attributes: ["fullName", "avatarURL"] },
        { model: db.tagPost, attributes: ["tags"] },
        { model: db.comment, attributes: ["text"] },
      ],
      order: [["date", "DESC"]],
    });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const postViews = await db.post.increment(
      { viewsCount: 1 },
      { where: { id: postId } }
    );

    const post = await db.post.findOne({
      where: { id: postId },
      include: [
        { model: db.user, attributes: ["fullName", "avatarURL"] },
        { model: db.tagPost, attributes: ["tags"] },
        {
          model: db.comment,
          attributes: ["text", "id", "userId", "date"],
          include: [{ model: db.user, attributes: ["fullName", "avatarURL"] }],
        },
      ],
    });

    res.json({ post });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const removePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await db.post.findOne({ where: { id: postId } });

    if (!post) {
      return res.json({ message: "пост не найден" });
    }
    const result = await db.post.destroy({
      where: { id: postId },
    });

    res.json({ message: "Post deleted...." });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, text, imageURL, tags } = req.body;

    const id = req.params.id;
    const userId = req.id;

    const postUpdate = await db.post.findOne({
      where: { id },
    });

    const postTagsUpdate = await db.tagPost.findOne({
      where: {
        postId: id,
      },
    });

    if (userId === postUpdate.userId) {
      postUpdate.imageURL = imageURL;
      postUpdate.title = title;
      postUpdate.text = text;
      postTagsUpdate.tags = tags;

      await postUpdate.save();
      await postTagsUpdate.save();

      return res.json(postUpdate);
    }

    res.json({ message: "нет доступа" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const createTags = async (req, res) => {
  try {
    const { tag } = req.body;

    //   Проверка на дубликат
    const duplicate = await db.tagList.findOne({ where: { tag } });
    if (duplicate) {
      return res.status(409).json({ "message": `Тег #${tag} уже существует` });
    }

    const tagList = await db.tagList.create({
      tag,
    });

    res.status(201).json({ message: "Tag create!" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const getTagsList = async (req, res) => {
  try {
    const tags = await db.tagList.findAll({
      attributes: ["tag"],
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getOnePost,
  removePost,
  updatePost,
  createTags,
  getTagsList,
};
