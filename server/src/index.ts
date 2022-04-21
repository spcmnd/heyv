import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const port = 8000;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
