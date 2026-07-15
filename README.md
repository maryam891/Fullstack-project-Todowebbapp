# 📝 Fullstack Todo Web App

A full-stack Todo web application built with React, TypeScript, Node.js/Express, and PostgreSQL. Passwords are securely hashed using bcrypt before storage and validated using bcrypt.compare during authentication.

Manage your tasks effortlessly – add, edit, and delete todos, and personalize them
with fun images to keep things engaging.

## Deployment

The application is deployed using:

-Frontend: Vercel
-Backend: Render
-Database: Neon PostgreSQL

## 🗄️ Database Migration

The project originally used SQLite durin development and was later migrated in July 2026 to PostgreSQL to support a production environment. The old schema sql schema is kept as "old-sqlite.sql" to show the migration history.

The migration included:

- Migrating exsisting users and todos
- Updating SQL queries from SQLite syntax to PostgreSQL
- Updating authentication and database connection handling

## 🛠️ Tech Stack

| Layer          | Technologies                  |
| -------------- | ----------------------------- |
| Frontend       | React, TypeScript, HTML, CSS  |
| Backend        | Node.js/Express               |
| Database       | PostgreSQL                    |
| Authentication | bcrypt password hashing       |
| Testing        | Vitest, React Testing Library |

> 🆕 Unit tests added May 2026

## 🧪 Testing

Run tests with:

```bash
cd frontend
npm run test
```

## ✨ Features

- ✅ Add, edit and delete todos
- 🎨 Personalize todos with fun images
