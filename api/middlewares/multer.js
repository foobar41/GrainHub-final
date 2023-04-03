const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const User = require("../models/User");
const glob = require("glob");
const fs = require("fs");

// Set the storage engine and file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    const fileName = req.params.id + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Handle file upload
router.post("/upload/:id", upload.single("image"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { image: file.path.replace(/\\/g, "/") },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.get("/fetch/:id", (req, res) => {
  const id = req.params.id;
  const directory = path.join(__dirname, "../images/")
  glob(directory + id + '.*', function (err, files) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Error retrieving image." });
      return;
    }
    if (files.length === 0) {
      res.status(404).send({ message: "Image not found." });
      return;
    }
    const imagePath = files[0]
    const ext = path.extname(imagePath);
    const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      const imageBase64 = Buffer.from(data).toString("base64");
      const dataUrl = `data:${mimeType};base64,${imageBase64}`;
      res.send(dataUrl);
    });
  });
});

module.exports = router;
