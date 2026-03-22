# CRUD API

A RESTful API for managing a product catalog, built with **Node.js**, **Fastify**, and **TypeScript**.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete products.
- **Horizontal Scaling**: Load Balancer using the Round-robin algorithm.
- **State Synchronization**: Consistent data state across all cluster workers.
- **Strict Validation**: Request body and UUID validation using **Zod**.
- **Error Handling**: Graceful handling of 400, 404, and 500 status codes.

---

## Tech Stack

- **Runtime**: Node.js (v>=24.10.0)
- **Framework**: Fastify
- **Language**: TypeScript
- **Validation**: Zod
- **Development**: nodemon, tsx
- **Testing**: Vitest

---

## Setup & Installation

1. **Clone the repository**:

   ```
   git clone https://github.com/annaAzh/crud-api-nodejs.git
   cd crud-api-nodejs
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Configure Environment**:
   Create a .env file in the root directory and specify the port (see .env.example):

   ```
   PORT=4000
   ```

## Running the App

The application supports three main execution modes:

1. Development Mode

   ```
   npm run start:dev
   ```

2. Production Mode

   ```
   npm run start:prod
   ```

3. Multi-Instance Mode

   ```
   npm run start:multi
   ```

## Testing

- Scenario 1: Full CRUD flow (Get -> Create -> Get -> Update -> Delete -> Get).
- Scenario 2: Validation.
- Scenario 3: Non-existing resources.

  ```
  npm run test
  ```

## API Routes

| Method     | Endpoint                                 | Description                   | Success Code |
| :--------- | :--------------------------------------- | :---------------------------- | :----------- |
| **GET**    | `http://localhost:PORT/api/products`     | Get all product records       | 200          |
| **GET**    | `http://localhost:PORT/api/products/:id` | Get product by UUID           | 200          |
| **POST**   | `http://localhost:PORT/api/products`     | Create a new product          | 201          |
| **PUT**    | `http://localhost:PORT/api/products/:id` | Update an existing product    | 200          |
| **DELETE** | `http://localhost:PORT/api/products/:id` | Remove product from in-memory | 204          |

## Request Body Example (POST / PUT)

When creating or updating a product, use the following JSON structure in the request body:

      {
        "name": "Bananas",
        "description": "Natural high-energy source",
        "price": 100,
        "category": "food",
        "inStock": true
      }

---

_This project was created for educational purposes as part of a Node.js course._
