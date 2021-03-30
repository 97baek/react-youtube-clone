const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema(
  {
    userTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
); // timestamps:true 는 만든 날짜와 업데이트 날짜 표시를 위한 것

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = { Subscriber };
