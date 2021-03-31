const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

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

router.post("/uploadVideo", (req, res) => {
  // 비디오 정보들 저장
  const video = new Video(req.body); // 클라이언트에서 보낸 모든 variables들을 담음

  video.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.get("/getVideos", (req, res) => {
  // 비디오를 DB에서 가져와서 클라이언트에 보냄
  Video.find()
    .populate("writer") // populate를 해줘야 Video 스키마에서 생성한 writer의 모든 정보(User의 모든 정보)를 가져올 수 있음
    .exec((err, videos) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videos });
    });
});

router.post("/getVideoDetails", (req, res) => {
  Video.findOne({ _id: req.body.videoId }) // 클라이언트에서 보낸 videoId를 id에 넣어 비디오 찾기
    .populate("writer")
    .exec((err, videoDetail) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, videoDetail });
    });
});

router.post("/getSubscriptionVideos", (req, res) => {
  // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
  Subscriber.find({ userFrom: req.body.userFrom }) //
    .exec((err, subscriberInfo) => {
      if (err) return res.status(400).send(err);
      let subscribedUser = [];

      subscriberInfo.map((subscriber, i) => {
        subscribedUser.push(subscriber.userTo);
      });
      // 찾은 사람들의 구독 비디오를 가져온다.
      Video.find({ writer: { $in: subscribedUser } }) // $in은 subscribedUser이 한명이 아니어도 모든 사람들의 아이디를 가지고 writer를 ㅏㅈ을 수 있음
        .populate("writer")
        .exec((err, videos) => {
          if (err) return res.status(400).send(err);
          return res.status(200).json({ success: true, videos });
        });
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
