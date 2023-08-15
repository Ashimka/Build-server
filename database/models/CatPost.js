module.exports = (sequelize, DataTypes) => {
  const CatPost = sequelize.define(
    "cat_post",
    {
      cats: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return CatPost;
};
