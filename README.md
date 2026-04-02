# QuizByte

Plataforma fullstack para estudar Java com conteúdos teóricos, anotações e quizzes.

# Colaboradores 

- **Pedro Henrique Talalayv Gomes**
- **Kaique Granato Santos Silva** 
- **Matheus Leão Mesquita Rincon**
- **Kevin Oliveira Matos** 

## Tecnologias

- **Backend**: Spring Boot 3 (Java 17, Maven, H2 em memória)
- **Frontend**: React + Vite

## Estrutura

- `backend` — API REST com:
  - `/api/quizzes` — questões de quiz
  - `/api/notes` — anotações de estudo
  - `/api/contents` — lista de tópicos (arrays, vetores, matrizes, tabela hash, POO, Spring Boot, Portugol)
- `frontend` — SPA em React com abas:
  - Início
  - Estudo (CRUD simples de anotações)
  - Conteúdos
  - Quiz
  - Admin (colaboradores: Kaique Granato, Matheus Leão, Pedro Talalayv e Kevin Matos)

## Como rodar

### Backend (Spring Boot)

1. Abra um terminal na pasta `backend`.
2. Execute:

   ```bash
   mvn spring-boot:run
   ```

3. O backend sobe em `http://localhost:8080` com H2 em memória.

### Frontend (React + Vite)

1. Abra outro terminal na pasta `frontend`.
2. Instale as dependências (apenas na primeira vez):

   ```bash
   npm install
   ```

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse o frontend em `http://localhost:5173`.

## Observações

- O backend já sobe com alguns conteúdos e perguntas de exemplo pré-carregados.
- A tela de Estudo consome a API de anotações.
- A tela de Conteúdos consome a API de conteúdos.
- A tela de Quiz consome a API de quizzes, com filtro por assunto.

