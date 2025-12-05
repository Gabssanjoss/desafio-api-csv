import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export async function getAllCursos(req: Request, res: Response) {
  try {
    const cursos = await prisma.curso.findMany();
    return res.json(cursos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao consultar cursos' });
  }
}
