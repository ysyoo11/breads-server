import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import threadsRouter from './router/threads.js';
import authRouter from './router/auth.js';
import { config } from './config.js';
import { sequelize } from './db/database.js';

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials -> 서버에서 응답을 보낼 때 이걸 허락한걸 보내면 브라우저가 받았을 때 이 정보를 안전하다고 판단하고 클라이언트 JS에게 보내줌
};

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan('tiny'));

app.use('/threads', threadsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

sequelize //
  .sync()
  .then(() => {
    console.log(`Server is started... ${new Date()}`);
    app.listen(config.port);
  });
