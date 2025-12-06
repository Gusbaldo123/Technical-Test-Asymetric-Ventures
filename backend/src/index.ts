import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

import authorRouter from "./routes/AuthorRouter"
import profileRouter from './routes/ProfileRouter';
import postRouter from './routes/PostRouter';
import categoryRouter from './routes/CategoryRouters';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/author', authorRouter);
app.use('/profile', profileRouter);
app.use('/post', postRouter);
app.use('/category', categoryRouter);

app.listen(PORT, (): void => {
  console.log(`hosted on http://localhost:${PORT}`);
});

