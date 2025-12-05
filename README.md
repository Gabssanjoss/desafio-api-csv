# Desafio CSV API

Este projeto implementa uma API capaz de receber um arquivo CSV grande (até 50.000 linhas), realizar diversas validações, aplicar regras de consistência e salvar os dados no banco de maneira transacional, garantindo integridade e performance.

A API foi desenvolvida utilizando Node.js, TypeScript, Express, Prisma e PostgreSQL.

## Sumário

1. [Objetivo](#objetivo)
2. [Lógica Utilizada](#lógica-utilizada)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Configuração do Ambiente](#configuração-do-ambiente)
6. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
7. [Como Rodar o Projeto](#como-rodar-o-projeto)
8. [Endpoints da API](#endpoints)
9. [Documentações Utilizadas](#documentações-utilizadas)
10. [Collection Postman](#collection-postman)

## Objetivo

Criar uma API que recebe um CSV contendo informações de alunos e realiza:

- Detecção de duplicatas dentro do próprio arquivo (pelo campo email).
- Validação de CPF.
- Verificação se o email já existe no banco.
- Verificação se o curso informado existe.
- Validação de data: não permitir datas futuras.
- Inserção no banco apenas se todos os dados forem válidos.
- Timeout de 60 segundos.
- Rollback automático caso qualquer etapa falhe.

## Lógica Utilizada

A lógica da API foi construída para resolver o desafio, validar os dados e salvar tudo no banco garantindo consistência e performance. O processo foi dividido em etapas claras.

1. O arquivo CSV é enviado via `POST /upload-csv` usando Multer.
2. O arquivo é lido pelo serviço `csvImportService` usando `csv-parser`.
3. O sistema valida:
   - Campos obrigatórios,
   - Emails duplicados,
   - Data de nascimento,
   - CPF,
   - Curso_id numérico.
4. Se passar, são realizadas validações no banco dentro de uma transação Prisma.
5. Em caso de sucesso, os dados são inseridos com `createMany()`.
6. Foi implementado um timeout de 60s usando `Promise.race`.
7. O arquivo CSV é removido ao final.
8. A API retorna a quantidade inserida ou os erros detalhados.

## Tecnologias Utilizadas

| Tecnologia | Versão |
|-----------|---------|
| Node.js | > 18 |
| TypeScript | > 5.9.3 |
| ts-node-dev | > 2.0.0 |
| Express | > 5 |
| Multer | > 2.0.2 |
| csv-parser | > 3.2.0 |
| Prisma ORM | > 6 |
| PostgreSQL | > 17 |

## Estrutura de Pastas

```
/src
  /controllers
  /services
  /routes
  /validations
  /database
/server.ts
/prisma
/uploads
```

## Configuração do Ambiente

Instale as dependências:

```
npm install
```

Crie o arquivo `.env`:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/desafio_csv?schema=public"
```

## Configuração do Banco de Dados

Criação do banco:

```
CREATE DATABASE desafio_csv;
```

Rode as migrations:

```
npx prisma migrate dev
```

Popular tabela de cursos:

```sql
INSERT INTO "Curso" ("nome") VALUES
  ('Engenharia de Software'),
  ('Direito'),
  ('Medicina');
```

## Como Rodar o Projeto

Servidor local:

```
npm run dev
```

Gerar CSV de 50k linhas (se existir script):

```
npm run csv:50k
```

A API estará disponível em:

```
http://localhost:3000
```

## Endpoints

### POST /upload-csv
Recebe o CSV e realiza validação e inserção.

### GET /cursos
Lista cursos cadastrados.

### GET /alunos
Lista alunos cadastrados.

## Documentações Utilizadas

https://nodejs.org/en/docs  
https://www.typescriptlang.org/docs/  
https://expressjs.com/  
https://github.com/expressjs/multer  
https://www.npmjs.com/package/csv-parser  
https://www.prisma.io/docs  
https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race 

### Auxílio GPT

## Collection Postman

https://www.postman.com/gabrielaanjos/workspace/desafio-csv-api
