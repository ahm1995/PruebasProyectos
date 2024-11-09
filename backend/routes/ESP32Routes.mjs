import express from "express";
import { createRecord } from "../controllers/ESP32Controller.mjs";

const ESP32Router = express.Router();

ESP32Router.post("/", createRecord);

export default ESP32Router;
