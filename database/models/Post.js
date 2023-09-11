module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      viewsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      imageURL: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Post;
};
