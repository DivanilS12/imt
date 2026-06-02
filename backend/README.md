# IMT Backend

Backend REST API para o IMT (Intelligent Market Tracker), um sistema para orientar estudantes na escolha de profissoes com IA, forum, curriculos e recomendacoes.

## Stack

- Node.js com ES Modules
- Express.js
- Firebase Authentication via Firebase Admin
- Firestore Database
- JWT
- Bcrypt
- Multer para upload de PDF
- OpenAI API preparada
- Arquitetura MVC

## Instalacao

```bash
cd backend
npm install
cp .env.example .env
```

Preencha o arquivo `.env` com as credenciais do Firebase Admin SDK e, opcionalmente, a chave da OpenAI.

## Variaveis de ambiente

```env
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5500
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@example.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
UPLOAD_DIR=uploads/curriculos
```

## Execucao

```bash
npm run dev
```

ou em producao:

```bash
npm start
```

A API sobe por padrao em `http://localhost:3000`.

## Colecoes Firestore

- `users`
- `professions`
- `favorites`
- `forum_topics`
- `forum_comments`
- `curriculos`
- `ia_history`

## Autenticacao

Todas as rotas protegidas usam:

```http
Authorization: Bearer <token>
```

O token retornado no login e registro e JWT. O middleware tambem aceita Firebase ID Token valido.

## Exemplos

### Registrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Ana\",\"email\":\"ana@email.com\",\"senha\":\"12345678\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"ana@email.com\",\"senha\":\"12345678\"}"
```

### Criar profissao

```bash
curl -X POST http://localhost:3000/api/professions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Desenvolvedor de Software\",\"descricao\":\"Cria sistemas web e mobile\",\"salarioMedio\":6500,\"percentualHomens\":70,\"percentualMulheres\":30,\"area\":\"Tecnologia\",\"habilidades\":[\"Logica\",\"JavaScript\"],\"mercado\":\"Alta demanda\",\"cursosRecomendados\":[\"ADS\",\"Ciencia da Computacao\"],\"graficoEmpregabilidade\":88,\"imagem\":\"\"}"
```

### Buscar profissoes

```bash
curl "http://localhost:3000/api/professions/search?q=software"
```

### Filtrar profissoes

```bash
curl "http://localhost:3000/api/professions/filter?area=Tecnologia&salarioMin=4000&empregabilidadeMin=70"
```

### Upload de curriculo

```bash
curl -X POST http://localhost:3000/api/curriculo/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "curriculo=@curriculo.pdf"
```

### Chat IA

```bash
curl -X POST http://localhost:3000/api/ia/chat \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Quais carreiras combinam com programacao e design?\"}"
```

## Rotas

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `PATCH /api/auth/update`
- `DELETE /api/auth/delete`

### Usuario

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/users/favorites`
- `POST /api/users/favorites`
- `DELETE /api/users/favorites/:id`

### Favoritos

- `POST /api/favorites/:professionId`
- `DELETE /api/favorites/:professionId`
- `GET /api/favorites`

### Profissoes

- `GET /api/professions`
- `GET /api/professions/:id`
- `POST /api/professions`
- `PUT /api/professions/:id`
- `DELETE /api/professions/:id`
- `GET /api/professions/search?q=`
- `GET /api/professions/filter?area=&salarioMin=&salarioMax=&empregabilidadeMin=`

### Forum

- `GET /api/forum/topics`
- `GET /api/forum/topics/:id`
- `POST /api/forum/topics`
- `PUT /api/forum/topics/:id`
- `DELETE /api/forum/topics/:id`
- `GET /api/forum/topics/:id/comments`
- `POST /api/forum/topics/:id/comments`
- `DELETE /api/forum/comments/:id`

### Curriculo

- `POST /api/curriculo/upload`
- `GET /api/curriculo/:id`
- `DELETE /api/curriculo/:id`

### IA

- `POST /api/analisador`
- `POST /api/ia/chat`
- `GET /api/ia/history`
- `DELETE /api/ia/history`

## Estrutura

```text
backend/
  src/
    config/
    controllers/
    middlewares/
    validators/
    routes/
    services/
    models/
    server.js
  .env.example
  package.json
  README.md
```

## Observacoes

- O analisador de curriculo aceita PDF e ja possui servico separado para plugar extracao de texto e IA.
- Sem `OPENAI_API_KEY`, as rotas de IA retornam uma resposta controlada informando que a integracao esta pronta.
- Para producao, use um `JWT_SECRET` forte e configure regras de seguranca adequadas no Firebase.
