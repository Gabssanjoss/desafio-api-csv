import fs from "fs";

const quantidade = 50000;
const caminho = "alunos_50000.csv";

const nomes = ["Ana Silva", "Bruno Souza", "Carlos Oliveira", "Daniela Pereira", "Fernanda Costa", "Gabriel Almeida", "Helena Gomes", "Igor Ramos", "Julia Melo", "Marcos Fernandes"];

function gerarLinha(i: number): string {
  const nome = nomes[i % nomes.length];
  const email = `pessoa${i}@example.com`;
  const cpf = String(10000000000 + i); 
  const ano = 1980 + (i % 20);         
  const mes = (i % 12) + 1;
  const dia = (i % 28) + 1;
  const data = `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  const cursoId = (i % 3) + 1;         

  return `${nome},${email},${cpf},${data},${cursoId}\n`;
}

function gerarCsvSimples() {
  let conteudo = "nome,email,cpf,data_nascimento,curso_id\n";

  for (let i = 0; i < quantidade; i++) {
    conteudo += gerarLinha(i);
  }

  fs.writeFileSync(caminho, conteudo, { encoding: "utf-8" });

  console.log(`CSV de ${quantidade} linhas gerado: ${caminho}`);
}

gerarCsvSimples();
