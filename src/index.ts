import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import { log } from 'console';
import helmet from 'helmet';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//handle cors
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token'
  );
  next();
});


app.listen(PORT, async () => {
  log(`Listening on port ${PORT}`);
});

export default app;
