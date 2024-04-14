const asyncHandler = require("express-async-handler");
const { body, check, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({
  limits: { fileSize: 2000000 },
});

const Puzzle = require("../models/puzzle");
const Image = require("../models/image");

const imageMimetype = [
  "image/jpeg",
  "image/png",
  "image/x-png",
  "image/svg+xml",
];

exports.puzzle_post = [
  upload.single("uploaded_image"),
  (req, res, next) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      const err = new Error("Can't upload puzzle on non-existent image");
      err.status = 404;
      return next(err);
    }
    if (!req.file) {
      return res.status(400).json({
        message: "No file to be uploaded!",
        status: 400,
      });
    }
    next();
  },
  body("name", "Name can't be empty").trim().isLength({ min: 1 }).escape(),
  body("coordinatex", "Coordinate X can't be empty")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Coordinate X must only contains numbers")
    .escape(),
  body("coordinatey", "Coordinate Y can't be empty")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Coordinate Y must only contains numbers")
    .escape(),
  check("mimetype")
    .custom(async (value, { req }) => {
      if (imageMimetype.includes(req.file.mimetype)) {
        return req.file.mimetype;
      } else {
        return false;
      }
    })
    .withMessage("Please only submit jpeg, png, or svg file!"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Failed to upload file");
      err.status = 422;
      details = errors.errors.map((object) => {
        return { msg: object.msg, path: object.path };
      });

      return res.status(422).json({
        message: "Failed to upload file",
        error: {
          status: 422,
          details,
        },
      });
    }

    const image = await Image.findOne(
      { _id: req.params.id },
      "_id name mimetype size"
    ).exec();

    if (image === null) {
      const err = new Error("Can't upload puzzle on non-existent image");
      err.status = 404;
      return next(err);
    }

    const puzzle = new Puzzle({
      name: req.body.name,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer,
      size: req.file.size,
      coordinates: `${req.body.coordinatex},${req.body.coordinatey}`,
      image: req.params.id,
    });

    await puzzle.save();

    res.json({
      message: "Successfully uploaded the file",
    });
  }),
  (err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.send("Max file size exceeded!");
    }

    next(err);
  },
];

exports.puzzles_get = asyncHandler(async (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error("Can't find puzzle on non-existent image");
    err.status = 404;
    return next(err);
  }

  const image = await Image.findOne({ _id: req.params.id }, "name").exec();

  if (image === null) {
    const err = new Error("Can't find puzzle on non-existent image");
    err.status = 404;
    return next(err);
  }

  const puzzles = await Puzzle.find({ image: req.params.id }).exec();
  return res.json({
    message: "Success",
    puzzles:
      puzzles.length > 0
        ? puzzles.map((puzzle) => {
            return {
              name: puzzle.name,
              coordinates: puzzle.coordinates,
              image: `data:${puzzle.mimetype};base64,${puzzle.base64_string}`,
            };
          })
        : [],
  });
});

exports.solution_post = (req, res, next) => {
  console.log({ body: req.body });

  res.json({
    message: success,
  });
};
