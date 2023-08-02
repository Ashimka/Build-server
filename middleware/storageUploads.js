const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },

  filename: (req, file, cb) => {
    const fileExt =
      file.originalname.split(".")[file.originalname.split(".").length - 1];

    let faleName = uuid.v4() + `.${fileExt}`;

    cb(null, faleName);
  },
});

const types = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const filterFile = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage, filterFile });
