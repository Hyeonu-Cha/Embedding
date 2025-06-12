# Embedding
Recommendation Program using Similarity, with OpenAI

# Semantic Search & Recommendation System

## Overview

This project is a simple Node.js application that demonstrates a semantic search and recommendation system. It uses the OpenAI API to generate vector embeddings for text data, which are then stored in a PostgreSQL database using the `pgvector` extension. This setup allows for powerful semantic similarity searches, enabling the discovery of related items based on meaning rather than just keywords.

## Features

-   **Text-to-Vector Conversion**: Utilizes OpenAI's `text-embedding-3-small` model to transform text into numerical vector representations.
-   **Vector Storage**: Stores text and its corresponding vector embedding in a PostgreSQL database.
-   **Semantic Search**: Performs cosine similarity searches to find and rank items by semantic relevance.
-   **Express API**: A simple API built with Express.js to handle adding and searching for items.

## Prerequisites

Before you begin, ensure you have the following installed and configured:

-   [Node.js](https://nodejs.org/)
-   A running [PostgreSQL](https://www.postgresql.org/) database instance.
-   The [`pgvector`](https://github.com/pgvector/pgvector) extension enabled on your PostgreSQL database.
-   An API Key from [OpenAI](https://platform.openai.com/).

## Installation

1.  **Clone the repository (or set up your project folder):**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

2.  **Install the required npm packages:**
    ```bash
    npm install
    ```

## Configuration

1.  **Database Setup:**
    Connect to your PostgreSQL database and run the following SQL commands to enable the `vector` extension and create the `items` table.
    ```sql
    -- Enable the pgvector extension
    CREATE EXTENSION IF NOT EXISTS vector;

    -- Create the table to store items and their embeddings
    -- The vector dimension for text-embedding-3-small is 1536
    CREATE TABLE items (
      id SERIAL PRIMARY KEY,
      title TEXT,
      embedding VECTOR(1536)
    );
    ```

2.  **Update Database Credentials:**
    In `index.js`, modify the `pg.Pool` configuration with your own database connection details.

    ```javascript
    // index.js
    const client = new pg.Pool({
      host: 'YOUR_DB_ADDRESS',
      user: 'YOUR_DB_USERNAME',
      password: 'YOUR_DB_PASSWORD',
      database: 'postgres',
      port: 5432,
      max: 5,
    });
    ```

3.  **Set OpenAI API Key:**
    In `index.js`, replace the placeholder `'API Key'` with your actual OpenAI API key in both the `/add` and `/search` routes.

    ```javascript
    // index.js -> inside /add and /search routes
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + 'YOUR_OPENAI_API_KEY'
    }
    ```

## Running the Application

Once the configuration is complete, you can start the server:

```bash
node index.js

The server will start and listen on http://localhost:8080.

Server http://localhost:8080

API Endpoints
GET /
Description: A simple root endpoint to confirm the server is running.

Response: Main Page

GET /add
Description: Adds a hardcoded item ("Fresh new Chicken Sandwich") to the database. It generates an embedding for the item's title and stores both in the items table. You can modify this endpoint to a POST request to dynamically add new items.

Usage: http://localhost:8080/add

GET /search
Description: Performs a semantic search on the items table based on a query parameter. It generates an embedding for the search query and finds the most similar items in the database using cosine similarity.

Usage: http://localhost:8080/search?q=<your_search_term>

Example:

http://localhost:8080/search?q=tasty%20chicken%20burger

Response: A JSON array of items from the database, ranked by their similarity score.

[
    {
        "id": 1,
        "title": "Fresh new Chicken Sandwich",
        "similarity": 0.89741...
    }
]
