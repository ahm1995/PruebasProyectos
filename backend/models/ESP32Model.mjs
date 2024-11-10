import mongoose from "mongoose";

const ESP32Schema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  temp: [
    {
      detection: {type: Number},
      time: {type: Date}
    }
  ],
  hum: [
    {
      detection: {type: Number},
      time: {type: Date}
    }
  ],
  light: [
    {
      detection: {type: Number},
      time: {type: Date}
    }
  ]
});

const ESP32 = mongoose.model("ESP32", ESP32Schema);

export default ESP32;
