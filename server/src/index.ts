import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rootController from './api/root-controller';
import { environment } from './config/env';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api/v1', rootController);

const port = 8000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
  console.log(environment);
});
