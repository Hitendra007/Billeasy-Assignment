# Book Review API

A RESTful API built with Node.js, Express, and MongoDB (Mongoose) for creating, retrieving, updating, and deleting books and reviews, with JWT-based authentication.

---

## 📦 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **Authentication**: JWT (JSON Web Tokens)
* **Pagination**: `mongoose-aggregate-paginate-v2`
* **Env Management**: dotenv
* **Testing/Collection**: Postman

---

## 🌱 Prerequisites

* Node.js (v16+)

---

## 🚀 Setup & Run Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/Hitendra007/Billeasy-Assignment.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root:

   ```ini
    PORT=8080
    CORS_ORIGIN=*
    MONGODB_URI=mongodb+srv://username:passsword@cluster0.jzuevgo.mongodb.net/
    ACCESS_TOKEN_SECRET=
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=
    REFRESH_TOKEN_EXPIRY=10d
   ```

4. **Run the server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:8000/api/v1`.

---

## 🔗 Database Schema
![image](https://github.com/user-attachments/assets/5e8e2e12-155d-4b2d-9e90-d5b467e25fc8)
### User

| Field          | Type   | Description                |
| -------------- | ------ | -------------------------- |
| `username`     | String | Unique, lowercase, indexed |
| `email`        | String | Unique, lowercase          |
| `fullName`     | String | User’s full name           |
| `password`     | String | Hashed before save         |
| `refreshToken` | String | Current refresh token      |

### Book

| Field    | Type          | Description                   |
| -------- | ------------- | ----------------------------- |
| `title`  | String        | Indexed, trimmed, required    |
| `author` | String        | Lowercased, trimmed, required |
| `price`  | Number        | Default 0, required           |
| `genre`  | String        | Optional                      |
| `user`   | ObjectId(ref) | Creator’s user ID             |

### Review

| Field     | Type          | Description                  |
| --------- | ------------- | ---------------------------- |
| `book`    | ObjectId(ref) | Reviewed book’s ID (indexed) |
| `user`    | ObjectId(ref) | Reviewer’s user ID (indexed) |
| `rating`  | Number        | 1–5, required                |
| `comment` | String        | Optional, trimmed            |

---

## 🛣️ API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Authentication

| Method | Endpoint               | Auth | Body                                       | Description                    |
| ------ | ---------------------- | ---- | ------------------------------------------ | ------------------------------ |
| POST   | `/users/register`      | No   | `{ username, email, fullName, password }`  | Register a new user            |
| POST   | `/users/login`         | No   | `{ username or email, password }`          | Login, returns JWTs in cookies |
| POST   | `/users/refresh-token` | No   | `{ refreshToken }` or via HTTP-only cookie | Refresh access token           |
| POST   | `/users/logout`        | Yes  | —                                          | Logout, clears auth cookies    |

### Books

| Method | Endpoint             | Auth | Query Params                                        | Body                              | Description                             |
| ------ | -------------------- | ---- | --------------------------------------------------- | --------------------------------- | --------------------------------------- |
| POST   | `/books/book`        | Yes  | —                                                   | `{ title, author, price, genre }` | Add a new book                          |
| GET    | `/books`             | No   | `page` (default 1), `limit` (10), `author`, `genre` | —                                 | List books with pagination & filters    |
| GET    | `/books/book/:id`    | No   | `page` (default 1), `limit` (5)                     | —                                 | Get book details + avg rating + reviews |
| GET    | `/books/book/search` | No   | `query`, `page`, `limit`                            | —                                 | Search books by title or author         |

### Reviews

| Method | Endpoint              | Auth | Body                    | Description                             |
| ------ | --------------------- | ---- | ----------------------- | --------------------------------------- |
| POST   | `/reviews/:book_id`   | Yes  | `{ rating, comment }`   | Submit a review (one per user per book) |
| PATCH  | `/reviews/:review_id` | Yes  | `{ rating?, comment? }` | Update your own review (partial update) |
| DELETE | `/reviews/:id`        | Yes  | —                       | Delete your own review                  |

---

## 📌 Design Decisions & Assumptions

* **PATCH vs PUT**: Used `PATCH` for `/reviews/:id` since updates are partial (modify only `rating` and/or `comment`).
* **Cookie-based JWT**: Stores access and refresh tokens in HTTP-only, secure cookies to mitigate XSS risks.
* **Route Naming**: Kept `/books/book` to distinguish single-resource actions, but could be simplified to `/books` & `/books/:id`.
* **Pagination Plugin**: `mongoose-aggregate-paginate-v2` for flexible aggregations (avg ratings + reviews).
* **Error Handling**: Centralized via `ApiError` and `asyncHandler` utils.

---

## 📫 Postman Collection

Postman collecton json is also present in git repo.
Set environment variable books to http://localhost:8080/api/v1. 

---
