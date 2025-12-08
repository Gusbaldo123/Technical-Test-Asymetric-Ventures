import express, { Application } from 'express';
import { config } from './managers/DotEnvManager';

import authorRouter from "./routes/AuthorRouter"
import postRouter from './routes/PostRouter';
import categoryRouter from './routes/CategoryRouters';

const app: Application = express();

app.use(express.json());

app.use('/author', authorRouter);
app.use('/post', postRouter);
app.use('/category', categoryRouter);

app.listen(config.port, (): void => {
  console.log(`hosted on http://localhost:${config.port}`);
});

