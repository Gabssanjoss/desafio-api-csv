import { Router } from 'express';
import { getAllCursos } from '../controllers/courseController';

const courseRouter = Router();

courseRouter.get('/cursos', getAllCursos);

export default courseRouter;
