const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
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

router.post("/thumbnail", (req, res) => {
  // 썸네일 생성 및 비디오 러닝타임 가져오기

  let thumbsFilePath = "";
  let fileDuration = "";

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    fileDuration = metadata.format.duration;
  });

  // 썸네일 생성
  ffmpeg(req.body.url) // req.body.url: 클라이언트에서 온 비디오 저장 경로 (uploads/)
    // 비디오 썸네일 filenames 생성
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "));
      console.log(filenames);

      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on("end", function () {
      // end: 썸네일이 다 생성되고 할 일
      console.log("Screenshots taken");
      return res.json({
        success: true,
        thumbsFilePath,
        fileDuration,
      });
    })
    .on("error", function (err) {
      console.log(err);
      return res.json({ success: false, err });
    })
    // 비디오의 구간 별로 스크린샷을 찍기
    .screenshots({
      count: 3, // count가 3이면 썸네일 3개 찍음
      folder: "uploads/thumbnails",
      size: "320x240",
      // '%b': 파일의 원래 이름 (익스텐션 제외)
      filename: "thumbnail-%b.png",
    });
});

module.exports = router;
