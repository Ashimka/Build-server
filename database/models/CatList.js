module.exports = (sequelize, DataTypes) => {
  const CatList = sequelize.define(
    "cat_list",
    {
      cat: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return CatList;
};
