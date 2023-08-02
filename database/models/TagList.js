module.exports = (sequelize, DataTypes) => {
  const TagList = sequelize.define(
    "tag_list",
    {
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return TagList;
};
