import { Router } from 'express';
import courseRouter from './courseRoutes';
import uploadRouter from './uploadRoutes';
import alunoRouter from './alunoRoutes';

const router = Router();

router.use(courseRouter);
router.use(uploadRouter);
router.use(alunoRouter);

export default router;
