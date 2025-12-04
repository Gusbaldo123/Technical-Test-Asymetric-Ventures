import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { authorService } from './models/AuthorService';
import { Author } from './generated/prisma/client';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response): Promise<void> => {
  console.log("ENTROU NA PORTA 3000")
  let author: Author = {
    id:0,
    name: "Cabelitos",
    email: "cabelitos@gusbaldo.com",
    password: "senha_cabelitos"
  };
  console.log(authorService.create(author));
  res.json({ message: 'Hello TypeScript with Node 25!' });
});

app.listen(PORT, (): void => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

