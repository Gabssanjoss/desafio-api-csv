import { Router } from 'express';
import upload from '../middlewares/upload';
import { uploadCsv } from '../controllers/uploadController';

const uploadRouter = Router();

uploadRouter.post('/upload-csv', upload.single('file'), uploadCsv);

export default uploadRouter;
