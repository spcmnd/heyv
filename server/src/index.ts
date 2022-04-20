import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const port = 8080;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
