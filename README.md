# Task Manager App ✅

A modern full-stack **Task Management** application built with **React**, **Node.js**, and **PostgreSQL**, providing user authentication, profile management, and secure token handling.

---

## ✨ Features

- 🔐 Authentication with JWT (Access + Long-Term Tokens)
- 📋 Task viewing and status management
- 📁 Protected user profile routes
- 🚀 Fast API with Express.js
- 🎨 Clean, responsive UI with Tailwind CSS
- 🧠 PostgreSQL for relational data storage
- ⚙️ Environment-based configuration with `.env`
- 📦 Modular folder structure with controllers, routes, and middlewares

---

## 🚀 Getting Started

Clone the repository using:

```bash
git clone https://github.com/bishnudev35/task-manager-app.git
```
first setup the .env file
```bash
DATABASE_URL="postgresql:de=require"
PORT=4000
JWT_SECRET=
```
then go to the server and then 
```bash
cd server
npm install

npx prisma generate
npx prisma db push
npm run dev
```
then go to client part
```bash
cd client 
npm install
npm run dev
```




