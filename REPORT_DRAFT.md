# Coursework Report Draft: Databases, Network and the Web

## Section 1: High-Level Schematic Diagram Description

The application follows a standard **3-tier architecture**, which separates the user interface, functional process logic, and data storage into distinct layers.

1.  **Presentation Tier (Client):** This tier consists of the frontend interface rendered using **EJS (Embedded JavaScript) templates** and styled with CSS. The client interacts with the application through a web browser, sending HTTP requests (GET and POST) to the server.
2.  **Logic Tier (Server):** The server is built using **ExpressJS (Node.js)**. This tier handles the application's business logic, routing, and communication between the presentation and data tiers.
    *   **Routes:** The application uses specific routes to connect the tiers. For example, `GET /users/list-users` triggers logic to fetch all users from the database, while `POST /users/add-user` processes form data from the client to be stored.
3.  **Data Tier (Database):** Data is persisted using **SQLite3**. This tier stores all application records in a `database.db` file. The server tier communicates with this tier using SQL queries executed via the `sqlite3` Node.js library.

**Extension Hook:**
[PLACEHOLDER: Describe how your specific extension hooks into this 3-tier structure. For example, if you added image uploads, explain how the Client sends the file, the Express server processes it using a library like `multer`, and the Data Tier stores the filename or path.]

---

## Section 2: Data Model / ER Diagram Description

The application's data model is designed to represent users and their associated email accounts.

### Tables and Schema:

1.  **users Table:**
    *   `user_id`: Primary Key (Integer, Autoincrement). Uniquely identifies each user.
    *   `user_name`: Text (Not Null). Stores the name of the user.

2.  **email_accounts Table:**
    *   `email_account_id`: Primary Key (Integer, Autoincrement). Uniquely identifies each email record.
    *   `email_address`: Text (Not Null). Stores the email address.
    *   `user_id`: Foreign Key (Integer). References `users(user_id)`. This creates a **One-to-Many relationship**, where one user can have multiple email accounts.

**ER Diagram Notation:** The final ER diagram must use **"crows feet" notation** to represent the relationship between `users` and `email_accounts`. One user (one side) connects to many email accounts (crow's foot side).

---

## Section 3: Extension Description

**Extension Summary:**
[PLACEHOLDER: Summarize the extension you chose to implement (e.g., Search functionality, User Authentication, Advanced Filtering, etc.).]

**Functionality:**
[PLACEHOLDER: Explain how the extension functions from the user's perspective.]

**Server-Side Techniques:**
[PLACEHOLDER: Describe how this extension applies or extends techniques covered in the course, such as advanced SQL queries, middleware usage, or complex routing.]

**Code References:**
*   **Logic Location:** [PLACEHOLDER: e.g., `Database/routes/users.js`, lines XX-YY]
*   **Schema Location:** [PLACEHOLDER: e.g., `Database/db_schema.sql`, lines XX-YY]
*   **Frontend Location:** [PLACEHOLDER: e.g., `Database/views/extension.ejs`]
