const Router = require("express");

const fileUpload = require("../middleware/storageUploads");

const router = new Router();

router.post("/", fileUpload.single("image"), (req, res) => {
  try {
    if (req.file) {
      res.json({
        url: `/${req.file.filename}`,
      });
    }
  } catch (error) {
    console.log(error);
    if (error.originalStatus === 413) {
      res.status(413).json({ message: "Допустимый размер изображений 1 Mb" });
    }
  }
});

module.exports = router;
