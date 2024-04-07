const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({
  limits: { fileSize: 2000000 },
});

const Image = require("../models/image");

const imageMimetype = [
  "image/jpeg",
  "image/png",
  "image/x-png",
  "image/svg+xml",
];

exports.image_post = [
  upload.single("uploaded_image"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No file to be uploaded!",
        status: 400,
      });
    }
    next();
  },
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

    const imageInstance = new Image({
      name: req.file.originalname,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer,
      size: req.file.size,
    });

    await imageInstance.save();

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
