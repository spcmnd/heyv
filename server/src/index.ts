import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rootController from './api/root-controller';
import { environment } from './config/env';

const { corsOrigin, port } = environment;
const app = express();

app.use(cors({ origin: corsOrigin }));
app.use(helmet());
app.use(express.json());
app.use('/api/v1', rootController);

app.listen(port, () => console.log(`Server is listening on port ${port}...`));
