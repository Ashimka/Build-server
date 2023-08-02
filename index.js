require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const db = require("./database/models");
const router = require("./routes/index");

const app = express();

const PORT = process.env.PORT || 5006;

app.use(cors());

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/api", router);

app.use("/api/uploads", express.static(path.join(__dirname, "upload")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

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
