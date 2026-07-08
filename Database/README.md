# Databases, Network and the Web - Coursework

This repository contains the web application for the Databases, Network and the Web (Apr 2026 Session) Midterm Coursework.

## Setup Instructions

To run this application locally, follow these steps:

1.  **Install Dependencies:**
    Open your terminal in the `Database/` directory and run:
    ```bash
    npm install
    ```

2.  **Build the Database:**
    Create the SQLite database from the schema script:
    *   **Mac/Linux:**
        ```bash
        npm run build-db
        ```
    *   **Windows:**
        ```bash
        npm run build-db-win
        ```

3.  **Start the Application:**
    Launch the web server:
    ```bash
    npm run start
    ```
    The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Dependencies

The following additional npm libraries are used in this project:

*   **express**: A minimal and flexible Node.js web application framework used to handle routing and server-side logic.
*   **ejs**: A simple templating language that lets you generate HTML markup with plain JavaScript, used for the presentation tier.
*   **sqlite3**: A library that provides a high-level API for interacting with the SQLite database in the data tier.
*   **body-parser**: Middleware used to parse incoming request bodies in a middleware before your handlers, available under the `req.body` property.
