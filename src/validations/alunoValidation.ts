import { AlunoImport } from '../services/csvImportService';

export interface ErroValidacao {
  linha: number;
  mensagem: string;
}

export function validarCPF(cpf: string): boolean {
  
  cpf = cpf.replace(/\D/g, '');

  if (cpf.length !== 11) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  return true;
}

export function validarDataNascimento(dataStr: string): boolean {
  const data = new Date(dataStr);
  if (isNaN(data.getTime())) return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);

  return data <= hoje;
}

export function validarAlunosBasico(alunos: AlunoImport[]): ErroValidacao[] {
  const erros: ErroValidacao[] = [];
  const emailsVistos = new Set<string>();

  for (const aluno of alunos) {
    const { linha, nome, email, cpf, dataNascimento, cursoId } = aluno;

    if (!nome || !email || !cpf || !dataNascimento || Number.isNaN(cursoId)) {
      erros.push({
        linha,
        mensagem:
          'Campos obrigatórios ausentes ou inválidos (nome, email, cpf, data_nascimento, curso_id)'
      });
    }

    if (emailsVistos.has(email)) {
      erros.push({
        linha,
        mensagem: `Email duplicado no próprio arquivo: ${email}`
      });
    } else if (email) {
      emailsVistos.add(email);
    }

    if (cpf && !validarCPF(cpf)) {
      erros.push({
        linha,
        mensagem: `CPF inválido: ${cpf}`
      });
    }

    if (dataNascimento && !validarDataNascimento(dataNascimento)) {
      erros.push({
        linha,
        mensagem: `Data de nascimento inválida ou futura: ${dataNascimento}`
      });
    }

    if (Number.isNaN(cursoId) || cursoId <= 0) {
      erros.push({
        linha,
        mensagem: `curso_id inválido: ${cursoId}`
      });
    }
  }

  return erros;
}
