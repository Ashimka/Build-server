module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatarURL: {
      type: DataTypes.STRING,
    },
  });

  return User;

  // const Role = sequelize.define(
  //   "role",
  //   {
  //     user: {
  //       type: DataTypes.INTEGER,
  //       defaultValue: 333,
  //     },
  //     admin: {
  //       type: DataTypes.INTEGER,
  //     },
  //     userId: {
  //       type: DataTypes.INTEGER,
  //       allowNull: false,
  //     },
  //   },
  //   {
  //     timestamps: false,
  //   }
  // );

  // Role.hasOne(User);
  // User.belongsTo(Role);
};
