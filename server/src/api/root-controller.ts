import express from 'express';
import { isDevEnv } from '../config/env';

const rootController = express.Router();

if (isDevEnv()) {
  rootController.all('/', (_, res) =>
    res.status(200).send({ message: 'Heyv API is working!' })
  );
}

export default rootController;
