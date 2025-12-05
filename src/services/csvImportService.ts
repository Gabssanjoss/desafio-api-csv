import fs from 'fs';
import csv from 'csv-parser';

export interface AlunoImport {
  linha: number;          
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string; 
  cursoId: number;     
}

export async function lerCsv(caminhoArquivo: string): Promise<AlunoImport[]> {
  return new Promise((resolve, reject) => {
    const resultados: AlunoImport[] = [];
    let numeroLinha = 1; 

    fs.createReadStream(caminhoArquivo)
      .pipe(
        csv({
          separator: ',',
          mapHeaders: ({ header }) => header.trim()
        })
      )
      .on('data', (data) => {
        numeroLinha++;

        const normalizado: Record<string, string> = {};
        for (const [chave, valor] of Object.entries(data)) {
          normalizado[chave.trim()] = String(valor ?? '').trim();
        }

        const todosVazios = Object.values(normalizado).every((v) => v === '');
        if (todosVazios) return;

        const cursoIdNumber = normalizado['curso_id']
          ? Number(normalizado['curso_id'])
          : NaN;

        resultados.push({
          linha: numeroLinha,
          nome: normalizado['nome'] ?? '',
          email: normalizado['email'] ?? '',
          cpf: normalizado['cpf'] ?? '',
          dataNascimento: normalizado['data_nascimento'] ?? '',
          cursoId: cursoIdNumber
        });
      })
      .on('end', () => resolve(resultados))
      .on('error', (err) => reject(err));
  });
}
