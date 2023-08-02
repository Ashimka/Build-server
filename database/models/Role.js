module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "role",
    {
      user: {
        type: DataTypes.INTEGER,
        defaultValue: 333,
      },
      admin: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );

  return Role;
};
