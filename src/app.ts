import express, { Request, Response } from 'express';
import router from './routes';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'API está rodando normalmente'
  });
});

app.use(router);

export default app;
