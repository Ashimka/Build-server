module.exports = (sequelize, DataTypes) => {
  const TagPost = sequelize.define(
    "tag_post",
    {
      tags: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return TagPost;
};
