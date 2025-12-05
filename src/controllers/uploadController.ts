import { Request, Response } from 'express';
import { importarAlunosDoCsv } from '../services/importAlunosService';

const IMPORT_TIMEOUT_MS = 60_000; 

export async function uploadCsv(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Nenhum arquivo enviado. Use o campo "file".'
    });
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject({ tipo: 'TIMEOUT' });
      }, IMPORT_TIMEOUT_MS);
    });

    const resultado = (await Promise.race([
      importarAlunosDoCsv(req.file.path),
      timeoutPromise
    ])) as Awaited<ReturnType<typeof importarAlunosDoCsv>>;

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Importação concluída com sucesso',
      linhasInseridas: resultado.inseridos
    });
  } catch (error: any) {
    console.error(error);

    if (error?.tipo === 'TIMEOUT') {
      return res.status(503).json({
        sucesso: false,
        mensagem: 'Processamento excedeu o tempo máximo de 60 segundos'
      });
    }

    if (error?.tipo === 'VALIDACAO') {
      return res.status(400).json({
        sucesso: false,
        mensagem: error.mensagem,
        erros: error.erros ?? null,
        detalhes: error.detalhes ?? null
      });
    }

    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno ao importar CSV'
    });
  }
}
