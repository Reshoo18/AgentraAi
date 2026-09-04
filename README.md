# 🤖 AgentraAi — Multi-Agent AI Assistant

AgentraAi is a **full-stack, multi-agent AI assistant platform** built with React.js, Node.js, Express.js, MongoDB, Redis, LangChain, LangGraph, Qdrant, Firebase Authentication, AWS S3, Razorpay and Docker.

The system is designed around a **microservices architecture** with an API Gateway that handles authentication and routes requests to independent backend services.

AgentraAi can automatically route user requests to specialized AI agents for:

* 💬 General AI Chat
* 🔎 Web Search
* 💻 Coding & Development
* 📄 PDF Analysis
* 📚 PDF RAG / Document Question Answering
* 🖼️ Image Generation
* 👁️ Image Analysis
* 📊 PPT Generation

---

## ✨ Key Features

### 🤖 Multi-Agent AI Architecture

AgentraAi uses **LangGraph** to orchestrate multiple specialized AI agents.

The system contains dedicated agents for:

* Chat
* Search
* Coding
* PDF
* PDF RAG
* PPT
* Vision / Image Generation
* Image Analysis

Users can either select an agent manually or use **Auto Mode**, where an LLM-based router determines which agent should handle the request.

---

### 🧠 Intelligent Agent Routing

The request first reaches the LangGraph router.

```text
User Request
     │
     ▼
LangGraph Router
     │
     ├── Chat Agent
     ├── Search Agent
     ├── Coding Agent
     ├── PDF Agent
     ├── PDF RAG Agent
     ├── PPT Agent
     ├── Vision Agent
     └── Image Analyzer
```

The router can also inspect uploaded files.

For example:

```text
PDF file      → PDF RAG Agent
Image file    → Image Analyzer
Text request  → LLM Router → Specialized Agent
```

---

# 🏗️ System Architecture

AgentraAi follows a **microservices-based backend architecture**.

```text
                         ┌──────────────────┐
                         │   React Frontend │
                         │   React + Redux  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    API Gateway   │
                         │ Express.js       │
                         │ Port: 5000       │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
      │ Auth Service│      │ Chat Service│      │Agent Service│
      │   :5001     │      │   :5002     │      │             │
      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
             │                    │                    │
             │                    │                    │
             └────────────┬───────┴────────────┬───────┘
                          │                    │
                          ▼                    ▼
                    ┌──────────┐        ┌──────────────┐
                    │ MongoDB  │        │    Redis     │
                    └──────────┘        └──────────────┘

                         ┌───────────────┐
                         │Billing Service│
                         │    :5003      │
                         └───────┬───────┘
                                 │
                                 ▼
                            Razorpay
```

---

# 🧩 Microservices

## 1. API Gateway

The API Gateway acts as the single entry point for the frontend.

Responsibilities:

* Request routing
* Authentication middleware
* Cookie handling
* CORS configuration
* User session validation
* User ID propagation between services
* Centralized API entry point

Routes:

```text
/api/auth
/api/chat
/api/agent
/api/billing
/api/me
```

The gateway forwards authenticated user information to downstream services using:

```text
x-user-id
```

---

## 2. Authentication Service

The authentication service handles user authentication and session management.

### Authentication Flow

```text
React Client
     │
     ▼
Firebase Authentication
     │
     ▼
Firebase ID Token
     │
     ▼
Auth Service
     │
     ├── Verify Firebase Token
     │
     ├── Find/Create User in MongoDB
     │
     ├── Generate Session ID
     │
     ├── Store Session in Redis
     │
     └── Set HTTP Cookie
```

Authentication uses:

* Firebase Admin SDK
* MongoDB
* Redis
* HTTP-only session cookie

User sessions are stored in Redis with an expiration time.

---

# 🔐 Redis Session Management

Redis is used as a fast session store.

Example:

```text
session:<sessionId>
```

Session information contains:

```json
{
  "userID": "...",
  "name": "...",
  "email": "...",
  "avatar": "...",
  "plan": "free",
  "credits": 100,
  "totalCredits": 100
}
```

The API Gateway validates the session before forwarding protected requests.

This avoids repeatedly querying MongoDB for every authenticated request.

---

# ⚡ Redis-Based Rate Limiting

Agent requests are rate limited using Redis counters.

Example key:

```text
rate:<userId>:<agent>
```

Each request increments the Redis counter:

```text
INCR rate:userId:agent
```

The counter expires after 60 seconds.

Current limits include:

| Agent  | Requests / Minute |
| ------ | ----------------: |
| Chat   |                20 |
| Coding |                 5 |
| Search |                 5 |
| PDF    |                 5 |
| PPT    |                 5 |
| Image  |                 5 |

When the limit is exceeded, the service returns HTTP `429`.

---

# 💾 Redis Conversation Memory

Redis is also used for short-term conversation memory.

Messages are stored using:

```text
messages-<conversationId>
```

The application keeps the most recent **20 messages** in Redis.

```text
User Message
     │
     ▼
Redis Conversation Memory
     │
     ▼
LLM / Agent
     │
     ▼
Assistant Response
```

Conversation data can also be recovered from the Chat Service when it is not present in Redis.

---

# 🤖 LangGraph Multi-Agent Workflow

The Agent Service uses **LangGraph StateGraph** for agent orchestration.

The graph contains:

```text
START
  │
  ▼
Router
  │
  ├── Chat
  ├── Search ──► Chat
  ├── Coding
  ├── PDF
  ├── PPT
  ├── Vision
  ├── PDF RAG
  └── Image Analyzer
  │
  ▼
END
```

A shared agent state contains information such as:

```text
prompt
aiResponse
agent
conversationId
searchResults
images
artifacts
userId
file
```

This allows different agents to operate on a common workflow state.

---

# 🧠 LLM Model Routing

Different tasks use different LLM providers/models.

The application abstracts model selection through:

```text
getModel(agent)
```

Current integrations include:

* Groq
* Google Gemini
* OpenRouter
* LangChain

Example architecture:

```text
                getModel()
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Groq      OpenRouter    Gemini
        │           │           │
     Chat/Search   Coding   Image Analysis
```

---

# 📚 PDF RAG System

AgentraAi includes a **Retrieval-Augmented Generation (RAG)** workflow for PDF documents.

The pipeline follows:

```text
PDF Upload
    │
    ▼
PDF Text Extraction
    │
    ▼
Text Splitting
    │
    ▼
Embeddings
    │
    ▼
Qdrant Vector Database
    │
    ▼
Similarity Search
    │
    ▼
Relevant Context
    │
    ▼
LLM
    │
    ▼
Answer
```

Technologies used:

* PDF parsing
* LangChain text splitters
* Google Gemini embeddings
* Qdrant
* LangChain Qdrant integration
* LLM-based response generation

This allows users to ask questions based on uploaded PDF documents.

---

# 🔎 Web Search Agent

The Search Agent uses **Tavily** to retrieve web information.

```text
User Query
    │
    ▼
Search Agent
    │
    ▼
Tavily Search
    │
    ▼
Search Results
    │
    ├── Text Results
    └── Images
```

The results are returned to the frontend and can be used as context for the chat response.

---

# 💻 Coding Agent

The Coding Agent is designed for development-related requests.

It can handle tasks such as:

* Code generation
* Debugging
* Project development
* Architecture discussions
* API design
* Programming questions

The coding workflow uses an LLM through LangChain/OpenRouter.

---

# 📄 PDF & 📊 PPT Generation

AgentraAi can generate documents based on user prompts.

### PDF

The PDF workflow uses:

```text
User Prompt
    │
    ▼
LLM
    │
    ▼
Generated Content
    │
    ▼
PDF Generation
    │
    ▼
S3 Upload
    │
    ▼
Signed Download URL
```

### PPT

The PPT agent generates structured presentation content as JSON.

The structure contains:

```json
{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": []
    }
  ]
}
```

The generated presentation is converted into a `.pptx` file and uploaded to AWS S3.

---

# 🖼️ AI Image Generation

The Vision Agent converts the user's request into a detailed image-generation prompt using an LLM.

The workflow is:

```text
User Prompt
     │
     ▼
LLM Prompt Engineering
     │
     ▼
Cloudflare Workers AI
     │
     ▼
FLUX Image Generation
     │
     ▼
Base64 Image
     │
     ▼
Buffer
     │
     ▼
AWS S3
     │
     ▼
Signed URL
```

The generated image is returned to the frontend through the response.

---

# 👁️ Image Analysis

Image uploads can automatically trigger the Image Analyzer agent.

The router checks the uploaded file's MIME type:

```text
image/*
```

and routes the request to:

```text
imageAnalyzer
```

The image analysis workflow uses a Gemini-based model.

---

# ☁️ AWS S3 File Storage

Generated files and images are stored in AWS S3.

The application uses:

```text
AWS SDK for JavaScript
```

S3 is used for:

* Generated images
* Generated PDFs
* Generated PPT files
* Uploaded/generated artifacts

Download links are generated using **presigned URLs**, allowing temporary access without exposing the storage bucket publicly.

---

# 💳 Credit-Based Usage System

AgentraAi uses a credit-based usage model.

Each agent consumes a different number of credits.

| Agent  | Credit Cost |
| ------ | ----------: |
| Chat   |           1 |
| Search |           5 |
| Coding |          10 |
| PDF    |          10 |
| PPT    |          10 |
| Vision |          10 |

The user's credits are stored in MongoDB and synchronized into their Redis session.

---

# 💰 Razorpay Billing

The Billing Service integrates Razorpay for subscription/payment handling.

Available plans in the current implementation:

| Plan    | Price | Credits | Validity |
| ------- | ----: | ------: | -------: |
| Free    |    ₹0 |     100 |  30 days |
| Starter |  ₹199 |     500 |  30 days |
| Pro     |  ₹499 |    1000 |  30 days |

Payment flow:

```text
Frontend
   │
   ▼
Billing Service
   │
   ▼
Create Razorpay Order
   │
   ▼
Razorpay Checkout
   │
   ▼
Payment
   │
   ▼
Signature Verification
   │
   ▼
Payment Database
   │
   ▼
Update User Plan & Credits
```

Razorpay payment signatures are verified using HMAC-SHA256 before updating the user's plan.

---

# 💬 Chat & Conversation Service

The Chat Service manages:

* Conversations
* Messages
* Conversation titles
* Message history
* Conversation deletion

MongoDB stores persistent conversation and message data.

Example message structure:

```json
{
  "conversationId": "...",
  "role": "user",
  "content": "Explain microservices"
}
```

Assistant responses can additionally contain:

```text
images
artifacts
```

This allows generated files and images to be associated with chat messages.

---

# 🔄 Inter-Service Communication

The services communicate through HTTP APIs.

Example:

```text
API Gateway
     │
     ▼
Agent Service
     │
     ├──► Chat Service
     │
     └──► Auth Service
```

The Agent Service:

1. Receives the request.
2. Stores the user message through Chat Service.
3. Adds the message to Redis memory.
4. Executes the LangGraph workflow.
5. Stores the assistant response.
6. Returns the final response, images and artifacts.

---

# 🛡️ Security

The project implements several security mechanisms:

* Firebase ID token verification
* Redis-backed sessions
* HTTP-only session cookies
* Protected API routes
* User ID propagation through gateway
* CORS with credentials
* Razorpay signature verification
* Presigned S3 URLs
* Redis rate limiting
* Credit-based usage control

---

# 🐳 Docker

Docker Compose is currently used for the Redis infrastructure.

```yaml
services:
  redis:
    image: redis
    ports:
      - "6379:6379"
```

Start Redis with:

```bash
docker compose up -d
```

> The current repository uses Docker Compose for Redis. The Node.js microservices themselves are currently started as separate Node processes rather than being individually containerized.

---

# 🗂️ Project Structure

```text
AgentraAi/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   │
│   ├── gateway/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── utils/
│   │
│   ├── services/
│   │   │
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── agent/
│   │   └── billing/
│   │
│   ├── shared/
│   │   └── redis/
│   │
│   ├── docker-compose.yml
│   └── package.json
│
└── package.json
```

---

# 🧰 Tech Stack

## Frontend

* React.js
* Redux Toolkit
* Axios
* Firebase
* Tailwind CSS
* React Markdown
* Monaco Editor
* Lucide React
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Redis
* ioredis
* Microservices Architecture
* API Gateway

## AI / GenAI

* LangChain
* LangGraph
* Groq
* Google Gemini
* OpenRouter
* Qdrant
* Tavily
* Cloudflare Workers AI
* FLUX

## Storage & Infrastructure

* AWS S3
* Docker
* Docker Compose
* Redis

## Authentication & Payments

* Firebase Authentication
* Firebase Admin SDK
* Razorpay

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/Reshoo18/AgentraAi.git

cd AgentraAi
```

---

## 2. Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

Install dependencies for the backend services:

```bash
cd backend
npm install
```

Then install dependencies inside the individual services:

```bash
cd gateway
npm install

cd ../services/auth
npm install

cd ../chat
npm install

cd ../agent
npm install

cd ../billing
npm install
```

---

# 🔑 Environment Variables

The application requires environment variables for the following services:

```env
MONGODB_URI=
REDIS_URL=

FRONTEND_URL=

AUTH_SERVICE=
CHAT_SERVICE=
AGENT_SERVICE=
BILLING_SERVICE=

GROQ_API_KEY=
GEMINI_API_KEY=

OPENROUTER_API_KEY=
TAVILY_API_KEY=

QDRANT_ENDPOINT=
QDRANT_API_KEY=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_KEY_ID=
AWS_BUCKET_NAME=

CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Firebase Admin credentials are also required by the authentication service.

**Never commit API keys, Firebase credentials, AWS credentials, Razorpay secrets, or other sensitive environment variables to GitHub.**

---

# ▶️ Running the Project

Start Redis:

```bash
cd backend
docker compose up -d
```

Start the Gateway:

```bash
cd backend/gateway
npm run dev
```

Start Auth Service:

```bash
cd backend/services/auth
npm run dev
```

Start Chat Service:

```bash
cd backend/services/chat
npm run dev
```

Start Agent Service:

```bash
cd backend/services/agent
npm run dev
```

Start Billing Service:

```bash
cd backend/services/billing
npm run dev
```

Start Frontend:

```bash
cd frontend
npm run dev
```

---

# 📡 API Overview

## Authentication

```http
POST /api/auth/login
GET  /api/auth/logout
GET  /api/me
```

## Conversations

```http
GET    /api/chat/create-conversation
GET    /api/chat/get-conversation
POST   /api/chat/update-conversation
POST   /api/chat/save-message
GET    /api/chat/get-messages/:conversationId
DELETE /api/chat/del-conversation/:conversationId
```

## AI Agent

```http
POST /api/agent/chat
```

Supports:

* Text prompts
* Agent selection
* File uploads

## Billing

```http
POST /api/billing/create-order
POST /api/billing/verify-payment
```

---

# 🔁 Complete Request Flow

A typical AI request works like this:

```text
React Frontend
      │
      │ POST /api/agent/chat
      ▼
API Gateway
      │
      │ Validate Redis Session
      ▼
Agent Service
      │
      ├── Save user message
      │       │
      │       ▼
      │   Chat Service
      │
      ├── Update Redis memory
      │
      ▼
LangGraph Router
      │
      ▼
Specialized Agent
      │
      ├── LLM
      ├── Search
      ├── RAG
      ├── Image Generation
      └── Document Generation
      │
      ▼
Result
      │
      ├── Text Response
      ├── Images
      └── Artifacts
      │
      ▼
Chat Service + Redis
      │
      ▼
API Gateway
      │
      ▼
React Frontend
```

---

# 🎯 Engineering Highlights

This project demonstrates practical implementation of:

* Microservices architecture
* API Gateway pattern
* Service-to-service communication
* Authentication & session management
* Redis caching
* Redis rate limiting
* Redis conversation memory
* MongoDB persistence
* LangGraph workflow orchestration
* Multi-agent AI architecture
* RAG pipeline
* Vector database integration
* LLM provider abstraction
* File processing
* AWS S3 object storage
* Presigned URLs
* Credit-based usage system
* Payment integration
* Razorpay signature verification
* Dockerized infrastructure
* React + Redux frontend architecture

---

# 📌 Future Improvements

Possible improvements include:

* Containerizing each microservice
* API Gateway load balancing
* Message queues for asynchronous workloads
* Centralized logging
* Distributed tracing
* Service health checks
* Automated CI/CD pipeline
* Kubernetes deployment
* Redis-based distributed locks for credit deduction
* Better API validation
* Automated tests
* Production-grade monitoring

---

# 👨‍💻 Author

**Reshoo Ranjan**

Full Stack Developer | MERN | GenAI | Microservices

GitHub:
https://github.com/Reshoo18

Project:
https://github.com/Reshoo18/AgentraAi
