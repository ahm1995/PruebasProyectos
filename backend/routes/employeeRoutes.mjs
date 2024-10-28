import express from 'express';
import { hrCreateEmployee, loginEmployee } from '../controllers/employeeControler.mjs';
import Employee from '../models/employeeModel.mjs';

const employeeRouter = express.Router();

employeeRouter.post('/', hrCreateEmployee)
employeeRouter.post('/login', loginEmployee)

export default employeeRouter;