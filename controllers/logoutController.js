const db = require("../database/models");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies) {
    return res.status(204).json({ "message": "Нет контента" });
  }

  const refreshToken = cookies.refresh_jwt;
  const foundUser = await db.user.findOne({ where: { refreshToken } });

  if (!foundUser) {
    return res.status(204).json({ "message": "Нет контента" });
  }

  //   delete refreshToken in DB
  const result = await db.user.findOne({
    where: { id: foundUser.id },
  });
  result.refreshToken = null;
  await result.save();

  res.clearCookie("refresh_jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(204).json({ "message": "Нет контента" });
};

module.exports = { handleLogout };
