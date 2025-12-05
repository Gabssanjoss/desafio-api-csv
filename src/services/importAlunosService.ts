import fs from 'fs';
import prisma from '../database/prismaClient';
import { lerCsv, AlunoImport } from './csvImportService';
import { validarAlunosBasico, ErroValidacao } from '../validations/alunoValidation';

interface ResultadoImportacao {
  inseridos: number;
}

interface ErroValidacaoBanco {
  tipo: 'VALIDACAO';
  mensagem: string;
  erros?: ErroValidacao[];
  detalhes?: unknown;
}


function criarErroValidacao(
  mensagem: string,
  extras: Partial<ErroValidacaoBanco> = {}
): ErroValidacaoBanco {
  return {
    tipo: 'VALIDACAO',
    mensagem,
    ...extras
  };
}

export async function importarAlunosDoCsv(
  caminhoArquivo: string
): Promise<ResultadoImportacao> {
  let alunos: AlunoImport[] = [];

  try {

    alunos = await lerCsv(caminhoArquivo);

    if (alunos.length === 0) {
      throw criarErroValidacao('Arquivo CSV vazio');
    }

    const errosBasicos = validarAlunosBasico(alunos);

    if (errosBasicos.length > 0) {
      throw criarErroValidacao('Erros de validação básica no CSV', {
        erros: errosBasicos
      });
    }

    const emails = alunos.map((a) => a.email.toLowerCase());
    const cursoIds = Array.from(new Set(alunos.map((a) => a.cursoId)));

    const resultado = await prisma.$transaction(async (tx) => {
      const emailsExistentes = await tx.aluno.findMany({
        where: { email: { in: emails } },
        select: { email: true }
      });

      if (emailsExistentes.length > 0) {
        const jaCadastrados = emailsExistentes.map((e) => e.email);
        throw criarErroValidacao('Existem emails já cadastrados no banco', {
          detalhes: jaCadastrados
        });
      }

      const cursosExistentes = await tx.curso.findMany({
        where: { id: { in: cursoIds } },
        select: { id: true }
      });

      const idsExistentes = new Set(cursosExistentes.map((c) => c.id));
      const cursosInexistentes = cursoIds.filter((id) => !idsExistentes.has(id));

      if (cursosInexistentes.length > 0) {
        const errosCursos = alunos
          .filter((a) => cursosInexistentes.includes(a.cursoId))
          .map((a) => ({
            linha: a.linha,
            mensagem: `curso_id não existe no banco: ${a.cursoId}`
          }));

        throw criarErroValidacao('Existem curso_id que não existem no banco', {
          erros: errosCursos,
          detalhes: cursosInexistentes
        });
      }

      await tx.aluno.createMany({
        data: alunos.map((a) => ({
          nome: a.nome,
          email: a.email,
          cpf: a.cpf,
          dataNascimento: new Date(a.dataNascimento),
          cursoId: a.cursoId
        })),
        skipDuplicates: false
      });

      return { inseridos: alunos.length };
    });

    return resultado;
  } finally {
    fs.unlink(caminhoArquivo, () => {});
  }
}
