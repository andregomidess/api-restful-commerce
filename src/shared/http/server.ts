import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import cors from 'cors';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload'

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use(errors());

app.use(
  (error: Error, request: Request, responde: Response, next: NextFunction) => {
    // se for erro que vem da nossa classe AppError retorna a mensagem nesse padrão ja conhecido
    if (error instanceof AppError) {
      return responde.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
      });
    }
    // se for um erro desconhecido retorna um 500
    return responde.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => {
  console.log('Server running on port 3333! ');
});
