require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const db = require("./database/models");
const router = require("./routes/index");

const app = express();

const PORT = process.env.PORT || 8050;

app.use(cors());

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api", router);

app.use("/api/uploads", express.static(path.join(__dirname, "upload")));

let root = require("path").join(__dirname, "/views");
app.use(express.static(root));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Соединение с БД было успешно установлено");

    // await db.sequelize.sync({ alter: true });
    // console.log("Все модели синхронизированы");

    app.listen(PORT, () => {
      console.log(`Сервер запущен успешно, номер порта: ${PORT}`);
    });
  } catch (error) {
    console.error("Невозможно выполнить подключение к БД: ", error);
  }
};

start();
