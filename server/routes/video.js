const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
// const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.mimetype);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (ext !== ".mp4") {
      console.log("it is not jpg");
      return cb(new Error("only mp4 is allowed"), false);
    }
    cb(null, true);
  },
}).single("file");

router.post("/uploadfiles", (req, res) => {
  // 비디오를 서버에 저장한다
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
  });
});

module.exports = router;
