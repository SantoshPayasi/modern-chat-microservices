# Chat Application - Microservices Architecture

A robust, scalable real-time chat application built with a modern microservices architecture. This project demonstrates advanced backend skills, including distributed systems, polyglot persistence, and event-driven communication.

## 🚀 Project Overview

This application is designed to handle real-time messaging with a focus on scalability and decoupling. It uses a monorepo structure managed by **pnpm workspaces** to organize distinct services.

### Key Features
*   **Microservices Architecture**: Functionally decomposed services for Auth and User management.
*   **Event-Driven Communication**: Asynchronous messaging between services using **RabbitMQ** to ensure loose coupling and reliability.
*   **Polyglot Persistence**: Usage of the right database for the right job — **MySQL** for authentication/transactional data and **PostgreSQL** for user profiles.
*   **Type Safety**: End-to-end type safety with **TypeScript** shared across services.
*   **Containerization**: Fully containerized environment using **Docker** and **Docker Compose** for consistent development and deployment.

## 🛠️ Tech Stack & Skills Highlight

### Core
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Node.js)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Package Manager**: [pnpm](https://pnpm.io/) (Monorepo Workspaces)

### Services & Databases
*   **Auth Service**: Handles registration, login, and JWT issuance.
    *   Database: **MySQL**
    *   ORM: **Sequelize**
    *   Validation: **Zod**
    *   Security: **Bcrypt**, **Helmet**
*   **User Service**: Manages user profiles and discovery.
    *   Database: **PostgreSQL**
    *   ORM: **Sequelize**

### Infrastructure & Messaging
*   **Message Broker**: [RabbitMQ](https://www.rabbitmq.com/) (amqplib)
*   **Containerization**: Docker, Docker Compose

## 📂 Project Structure

```
├── packages
│   └── common          # Shared libraries, types, and utilities
├── services
│   ├── auth-service    # Authentication & Authorization (MySQL)
│   ├── user-service    # User Profile Management (PostgreSQL)
│   └── gateway-service # API Gateway (planned/in-progress)
├── docker-compose.yaml # Orchestration for DBs and Broker
├── package.json        # Root workspace config
└── pnpm-workspace.yaml # Workspace definitions
```

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18+)
*   pnpm (`npm install -g pnpm`)
*   Docker & Docker Compose

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd chat-app
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Start Infrastructure**
    Spin up the databases (MySQL, Postgres) and RabbitMQ.
    ```bash
    docker-compose up -d
    ```

4.  **Run Services (Development)**
    You can run services individually or all together depending on the script setup.
    ```bash
    # Run all services in dev mode (if script exists)
    pnpm run dev

    # OR run specific service
    pnpm --filter @chat-app/auth-service run dev
    pnpm --filter @chat-app/user-service run dev
    ```

## 🔧 Environment Variables

Each service has its own `.env` configuration (mapped from `docker-compose.yaml` or `.env` files).

**Common Variables:**
*   `PORT`: Service port
*   `RABBITMQ_URL`: AMQP connection string
*   `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Database credentials

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
