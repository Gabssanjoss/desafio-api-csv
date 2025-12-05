import { Request, Response } from 'express';
import prisma from '../database/prismaClient';

export async function getAllAlunos(req: Request, res: Response) {
  try {
    const alunos = await prisma.aluno.findMany({
      include: {
        curso: true
      }
    });

    return res.json(alunos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao listar alunos' });
  }
}
