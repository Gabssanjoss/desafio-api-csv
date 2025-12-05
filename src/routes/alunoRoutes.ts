import { Router } from 'express';
import { getAllAlunos } from '../controllers/alunoController';

const alunoRouter = Router();

alunoRouter.get('/alunos', getAllAlunos);

export default alunoRouter;
