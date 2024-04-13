const express = require("express");
const router = express.Router();

const imageController = require("../controllers/imageController");

router.post("/", imageController.image_post);

router.get("/:id", imageController.image_get);

module.exports = router;
