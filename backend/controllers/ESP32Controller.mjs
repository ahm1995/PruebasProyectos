import ESP32 from "../models/ESP32Model.mjs";

export const createRecord = async (req, res) => {
  try {
    const { UID } = req.body;

    const existingRecord = await ESP32.findOne({ UID });

    if (!existingRecord) {
      const newRecord = new ESP32({ UID });
      await newRecord.save();
      res.status(201).json({ message: "Registro exitoso" });
    } else {
      existingRecord.lastDetected = new Date();
      existingRecord.detections.push({ detectedAt: new Date() });
      await existingRecord.save();
      return res.status(200).json({ message: "Tag ya registrado", new: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
};
