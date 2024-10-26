const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const uploadRouter = express.Router();

// Configuración de multer para manejar la carga de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Crear un cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Ruta para cargar archivos
uploadRouter.post("/", upload.single("file"), async (req, res) => {
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.file.originalname, // Nombre del archivo en S3
      Body: req.file.buffer, // El contenido del archivo
    };

    // Subir el archivo a S3
    await s3Client.send(new PutObjectCommand(uploadParams));
    res.status(200).json({ message: "Archivo subido con éxito" });
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    res.status(500).json({ error: "Error al subir el archivo" });
  }
});

module.exports = uploadRouter;
