import ESP32 from "../models/ESP32Model.mjs";

export const createRecord = async (req, res) => {
  try {
    // Obtenemos los datos del sensor
    const { temp, hum, luz, timestamp } = req.body;
    
    // Convertimos el timestamp a Date y obtenemos solo la fecha (sin hora)
    const measureDate = new Date(timestamp);
    measureDate.setHours(0, 0, 0, 0);

    // Buscamos si existe un registro para ese día
    const existingRecord = await ESP32.findOne({
      date: {
        $gte: measureDate,
        $lt: new Date(measureDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!existingRecord) {
      // Si no existe registro para ese día, creamos uno nuevo
      const newRecord = new ESP32({
        date: measureDate,
        temp: [{
          detection: temp,
          time: timestamp
        }],
        hum: [{
          detection: hum,
          time: timestamp
        }],
        light: [{
          detection: luz,
          time: timestamp
        }]
      });

      await newRecord.save();
      res.status(201).json({ 
        message: "Nuevo registro diario creado",
        record: newRecord 
      });
    } else {
      // Si existe el registro, agregamos las nuevas mediciones
      existingRecord.temp.push({
        detection: temp,
        time: timestamp
      });
      
      existingRecord.hum.push({
        detection: hum,
        time: timestamp
      });
      
      existingRecord.light.push({
        detection: luz,
        time: timestamp
      });

      await existingRecord.save();
      res.status(200).json({ 
        message: "Mediciones agregadas al registro existente",
        record: existingRecord
      });
    }
  } catch (error) {
    console.error("Error en createRecord:", error);
    res.status(500).json({ 
      message: "Error al procesar el registro", 
      error: error.message 
    });
  }
};

// Función adicional para obtener registros por fecha
export const getRecordByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    const record = await ESP32.findOne({
      date: {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!record) {
      return res.status(404).json({ message: "No se encontraron registros para esta fecha" });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Error en getRecordByDate:", error);
    res.status(500).json({ 
      message: "Error al obtener el registro", 
      error: error.message 
    });
  }
};

// Función para obtener el último registro
export const getLastRecord = async (req, res) => {
  try {
    const record = await ESP32.findOne()
      .sort({ date: -1 })
      .limit(1);

    if (!record) {
      return res.status(404).json({ message: "No hay registros disponibles" });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("Error en getLastRecord:", error);
    res.status(500).json({ 
      message: "Error al obtener el último registro", 
      error: error.message 
    });
  }
};