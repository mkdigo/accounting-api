# Accounting API

Bem-vindo a documentação da API do **Accounting**. Esta é uma API RESTful de alta performance construída para gerencimento financeiro, baseado em lançamentos contábeis.

A aplicação foi desenvolvida seguindo os princípios de **Domain-Driven Design (DDD)**, **Clean Architecture**, e implementada utilizando **Fastify** com **TypeScript** para garantir máxima eficiência e tipagem estática robusta.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime:** Node.js v24+
- **Framework Web:** Fastify
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL (via Prisma ORM)
- **Autenticação:** JWT (JSON Web Tokens) com rotação de Refresh Tokens
- **Containerização:** Docker & Docker Compose
- **Validação de Dados:** Zod

---

## 📋 Arquitetura e Fluxo de Dados

A API utiliza uma abordagem de **Arquitetura Hexagonal (Portas e Adaptadores)**. O fluxo de uma requisição segue estritamente a ordem abaixo:

1.  **HTTP Request** -> Capturado pelo Fastify (Controller/Route Adapter)
2.  **DTO Validation** -> Validação do payload usando esquemas Zod
3.  **Use Case (Application Layer)** -> Execução da lógica de negócio pura
4.  **Entities/Aggregates (Domain Layer)** -> Aplicação das regras e invariantes de domínio
5.  **Gateway/Repository (Infrastructure Layer)** -> Persistência de dados no banco PostgreSQL

---

## 🏃 Como Executar o Projeto Localmente

### Pré-requisitos

- Docker instalado
- Node.js v24+ configurado

### Passo a Passo

1 - Clone o repositório:

```bash
git clone [https://github.com/mkdigo/powerlifting-api.git](https://github.com/mkdigo/powerlifting-api.git)
cd powerlifting-api
```

2 - Instale as dependências:

```bash
npm install
```

3 - Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4 - Gere a chave secreta para a applicação:

```bash
npm run app:secret
```

5 - Gere a chave secreta para o JWT Token:

```bash
npm run jwt:secret
```

6 - Suba o ambiente com o Docker:

```bash
docker compose up -d
```

7 - Execute as Migrations do banco de dados:

```bash
npm run migrate:dev
```

8 - Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível no endereço http://localhost:3000.

## 🗺️ Endpoints

A documentação dos endpoints é feita através do Swagger.

http://localhost:3000/documentation

## 🔐 Autenticação & Segurança

A maioria dos endpoints desta API exige autenticação por meio de um token Bearer JWT.

- O token de acesso deve ser enviado no cabeçalho de todas as requisições protegidas:

```http
    Authorization: Bearer <seu_access_token>
```

- **Tempo de expiração do Access Token:** 60 minutos.
- **Tempo de expiração do Refresh Token:** 7 dias (enviado via HTTP-only Cookie para máxima segurança contra ataques XSS).

## 🚫 Tratamento de Erros Padrão

**Todas as falhas na API retornam uma estrutura padronizada para facilitar o consumo pelo Front-End:**

Resposta de Erro (404 Bad Request)

```json
{
  "message": "Invalid input.",
  "errors": {
    "name": ["Invalid input: expected string, received undefined"]
  }
}
```

_Com exceção das respostas Bad Request(400), errors sempre será undefined._

| Descrição                                               | Status HTTP        |
| ------------------------------------------------------- | ------------------ |
| Erro na validação do Zod (payload incorreto).           | 400 Bad Request    |
| Token JWT ausente, expirado ou inválido.                | 401 Unauthorized   |
| O usuário autenticado não tem permissão para o recurso. | 403 Forbidden      |
| O recurso solicitado não pôde ser localizado.           | 404 Not Found      |
| O usuário não verificou o e-mail.                       | 422 Not Found      |
| Erro inesperado nos servidores da aplicação.            | 500 Internal Error |
