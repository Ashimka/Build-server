module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
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
    avatarURL: {
      type: DataTypes.STRING,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activationLink: {
      type: DataTypes.STRING,
    },
  });

  return User;
};
