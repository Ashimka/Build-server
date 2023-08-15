const { format } = require("date-fns");
const { Op } = require("sequelize");

const db = require("../database/models");

const createPost = async (req, res) => {
  try {
    const { title, text, imageURL, cats } = req.body;
    const date = `${format(new Date(), "dd-MM-yyyy\tHH:mm")}`;

    const newPost = await db.post.create({
      title,
      text,
      imageURL,
      userId: req.id,
      date,
    });

    const tagsPost = await db.CatPost.create({
      postId: newPost.id,
      cats,
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
        { model: db.user, attributes: ["login", "avatarURL"] },
        { model: db.CatPost, attributes: ["cats"] },
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
        { model: db.user, attributes: ["login", "avatarURL"] },
        { model: db.CatPost, attributes: ["cats"] },
        {
          model: db.comment,
          attributes: ["text", "id", "userId", "date"],
          include: [{ model: db.user, attributes: ["login", "avatarURL"] }],
        },
      ],
    });

    res.json({ post });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const getCategoriePost = async (req, res) => {
  try {
    const cat = req.query.category;

    const postId = await db.CatPost.findAll({
      where: { cats: cat },
      attributes: ["postId"],
    });

    const id = postId.map((id) => id.postId);

    const posts = await db.post.findAll({
      where: { id },
      include: [
        { model: db.user, attributes: ["login", "avatarURL"] },
        { model: db.CatPost, attributes: ["cats"] },
        { model: db.comment, attributes: ["text"] },
      ],
    });
    res.json(posts);
  } catch (error) {
    console.log(error);
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
    const { title, text, imageURL, cats } = req.body;

    const id = req.params.id;
    const userId = req.id;

    const postUpdate = await db.post.findOne({
      where: { id },
    });

    const postTagsUpdate = await db.CatPost.findOne({
      where: {
        postId: id,
      },
    });

    if (userId === postUpdate.userId) {
      postUpdate.imageURL = imageURL;
      postUpdate.title = title;
      postUpdate.text = text;
      postTagsUpdate.cats = cats;

      await postUpdate.save();
      await postTagsUpdate.save();

      return res.json(postUpdate);
    }

    res.json({ message: "нет доступа" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const createCats = async (req, res) => {
  try {
    const { cat } = req.body;

    //   Проверка на дубликат
    const duplicate = await db.CatList.findOne({ where: { cat } });
    if (duplicate) {
      return res.status(409).json({ "message": `Тег #${cat} уже существует` });
    }

    const catList = await db.CatList.create({
      cat,
    });

    res.status(201).json({ message: "Categorie create!" });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

const getTagsList = async (req, res) => {
  try {
    const cats = await db.CatList.findAll({
      attributes: ["cat"],
    });
    res.json(cats);
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getOnePost,
  getCategoriePost,
  removePost,
  updatePost,
  createCats,
  getTagsList,
};
