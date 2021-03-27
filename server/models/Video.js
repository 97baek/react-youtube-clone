const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId, // 이렇게 넣으면 아이디만 넣어도 User 모델의 모든 정보들을 긁어올 수 있음
      ref: "User", // 불러올 곳 명시
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    privacy: {
      type: Number, // 0: privacy, 1: public
    },
    filePath: {
      type: String,
    },
    category: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
); // timestamps:true 는 만든 날짜와 업데이트 날짜 표시를 위한 것

const Video = mongoose.model("Video", videoSchema);

module.exports = { Video };
