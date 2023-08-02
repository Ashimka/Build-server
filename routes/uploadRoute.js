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
  }
});

module.exports = router;
