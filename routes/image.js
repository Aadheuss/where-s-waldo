const express = require("express");
const router = express.Router();

const imageController = require("../controllers/imageController");
const puzzleController = require("../controllers/puzzleController");

const puzzleRouter = require("../routes/puzzle");

router.post("/", imageController.image_post);

router.get("/:id", imageController.image_get);

router.post("/:id/puzzle", puzzleController.puzzle_post);

router.get("/:id/puzzles", puzzleController.puzzles_get);

module.exports = router;
