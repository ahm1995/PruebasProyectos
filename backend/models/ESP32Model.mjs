import mongoose from "mongoose";

const ESP32Schema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  UID: {
    type: String,
  },
  // detections: [
  //   {
  //     detectedAt: {
  //       type: Date,
  //       default: Date.now(),
  //     },
  //   },
  //],
});

const ESP32 = mongoose.model("ESP32", ESP32Schema);

export default ESP32;
