# 🗒️ Notes API (Node.js + MongoDB + Docker)

This simple Notes API demonstrates RESTful service design with secure user authentication, Dockerized deployment, and MongoDB integration. Built to reinforce modern backend development practices for scalable systems.

---

## 🚀 Features

- Secure user registration and login (JWT-based authentication)
- Create, read, update, and delete notes
- Filter notes by search text and tags
- Optional: Match notes by **any** or **all** tags
- Notes are scoped per authenticated user
- Dockerized backend with MongoDB database
- Ready for testing with Postman or any HTTP client

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- Docker + Docker Compose
- Postman (for testing)

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/XiniDev/notes-api.git
cd notes-api
```

### 2. Set Up Environment Variables

Create a `.env` file in the root of the project with the following content:

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/notesdb
JWT_SECRET=your_jwt_secret_here
ADMIN_SECRET=your_admin_secret_here
```

> Replace `your_jwt_secret_here` and `your_admin_secret_here` with a secure string.
> Adjust the `MONGO_URI` if you're using MongoDB outside of Docker.

**Alternatively, use the sample_env.txt inside the postman directory (it matches with the postman tests)**

### 3. Start the App with Docker

```bash
docker-compose up --build
```

The API will be available at:  
`http://localhost:3000`

---

## 🔐 Authentication

Use the following endpoints to register or log in and receive a JWT:

### POST `/auth/register`

```json
{
  "username": "yourname",
  "password": "yourpassword"
}
```
For registering admin accounts:

```json
{
  "username": "adminname",
  "password": "adminpassword",
  "role": "admin",
  "adminSecret": "your_admin_secret_here",
}
```

### POST `/auth/login`

```json
{
  "username": "yourname",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "token": "your_jwt_token_here"
}
```

All secured endpoints require this token in the headers:

```
Authorization: Bearer your_jwt_token_here
```

---

## 📝 Notes Endpoints

### GET `/notes`

- Optional query: `q`, `tags`, `match=all|any`
- Filters by title/content or tags

### POST `/notes`

Create a new note:

```json
{
  "title": "My Note",
  "content": "Note content...",
  "tags": ["tag1", "tag2"]
}
```

### PUT `/notes/:id`

Update a note

### DELETE `/notes/:id`

Delete a note

> All note operations are **user-specific** (scoped to the logged-in user).

---

## 📫 Postman Collection

Import the included Postman collection in the postman directory with the sample_env.txt variables to test endpoints.

---

## 🐳 Docker Notes

Make sure Docker and Docker Compose are installed. The app runs via:
- `api` service (Node/Express)
- `mongo` service (MongoDB)

Use this command to tear down everything and remove volumes:

```bash
docker-compose down -v
```

---

## 🧑‍💻 Author

Made by [XiniDev](https://github.com/XiniDev)