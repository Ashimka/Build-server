const dbConfig = require("../dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  define: {
    freezeTableName: true,
  },

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },

  logging: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User.js")(sequelize, DataTypes);
db.role = require("./Role.js")(sequelize, DataTypes);
db.post = require("./Post.js")(sequelize, DataTypes);
db.comment = require("./Comment.js")(sequelize, DataTypes);
db.CatList = require("./CatList.js")(sequelize, DataTypes);
db.CatPost = require("./CatPost.js")(sequelize, DataTypes);

const User = db.user;
const Role = db.role;
const Post = db.post;
const Comment = db.comment;
const CatList = db.CatList;
const CatPost = db.CatPost;

// связь один к одному User k Role
User.hasOne(Role, {
  onDelete: "CASCADE",
});

Post.hasOne(CatPost, {
  onDelete: "CASCADE",
});

// связь один ко многим Post k Comment
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User, { onDelete: "CASCADE" });

User.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(User, { onDelete: "CASCADE" });

Post.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(Post, { onDelete: "CASCADE" });

module.exports = db;
