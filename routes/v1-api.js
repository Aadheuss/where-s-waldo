const express = require("express");
const router = express.Router();

const imageRouter = require("./image");

router.use("/image", imageRouter);

module.exports = router;
