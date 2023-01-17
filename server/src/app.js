import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import employeesRouter from './api/routes/employees.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';

dotenv.config();
const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(morgan('dev'));

app.use(express.static(path.join(process.cwd(), '/public')));
app.use(express.static(path.join(process.cwd(), '/client')));
app.use(express.json());

app.use('/employees', employeesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, () => console.log(`Server is running on port ${PORT}`));
