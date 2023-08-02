const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    const rolesArrey = [...allowedRoles];

    const result = req.roles
      .map((role) => rolesArrey.includes(role))
      .find((value) => value === true);

    if (!result) {
      return res.status(401).json({ message: "Нет доступа" });
    }
    next();
  };
};
module.exports = verifyRoles;
