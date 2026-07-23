# INFNOVA Internship API

A robust, production-ready REST API for managing internship applicants, built with NestJS, Prisma, and SQLite.

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based login for administrators with Passport.js guards.
- **Applicant Management**: Full CRUD operations with strict business rules (e.g., unique email enforcement, status state-machine validation).
- **Soft Deletes**: Applicants are never permanently removed; they are safely hidden via a `deletedAt` timestamp.
- **Advanced Querying**: Paginated lists with case-insensitive search, filtering by status/track, and dynamic sorting.
- **Analytics Dashboard**: Real-time summary statistics excluding soft-deleted records, optimized with concurrent database queries.
- **API Documentation**: Fully interactive Swagger (OpenAPI) UI.
- **Automated Testing**: Comprehensive unit tests covering core business logic and security edge cases.

## 🛠️ Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: SQLite
- **ORM**: Prisma
- **Authentication**: Passport.js, JWT, bcrypt
- **Validation**: `class-validator`, `class-transformer`
- **Documentation**: Swagger (`@nestjs/swagger`)
- **Testing**: Jest

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm
- Docker & Docker Compose (Recommended for easiest setup)

---

## 🐳 Running with Docker (Recommended)

If you have Docker and Docker Compose installed, you can run the entire application with a single command. This handles dependency installation, database setup, and seeding automatically.

1. **Build and start the container:**
   ```bash
   docker compose up --build
   ```
2. The API will be running at `http://localhost:3000`.
3. To stop the container, press `Ctrl + C` in the terminal, then run:
   ```bash
   docker compose down
   ```
   *(Note: Use `docker compose down -v` if you want to completely wipe the local SQLite database and start fresh).*

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd internship-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(You can update the `JWT_SECRET` in the `.env` file to a secure random string if desired).*

4. **Initialize the Database:**
   This will create the SQLite database and sync the schema.
   ```bash
   npx prisma db push
   ```
   *(Note: If you are using Prisma Migrate instead, use `npx prisma migrate dev --name init`)*

5. **Seed the Database:**
   Populate the database with a default Admin user.
   ```bash
   npx prisma db seed
   ```
   *(Note: Because your `package.json` seed script points to `dist/prisma/seed.js`, you may need to run `npm run build` before this step).*

   **Default Admin Credentials:**
   - Email: `admin@infnova.com`
   - Password: `password123`

## 🏃 Running the Application

Start the development server with hot-reload:
```bash
npm run start:dev
```
The API will be running at `http://localhost:3000`.

## 📖 API Documentation (Swagger)

Once the server is running, open your browser and navigate to:
**[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

> **Note:** To test protected routes in Swagger, click the **"Authorize"** button at the top right, log in via the `/api/auth/login` endpoint to get your token, and enter it in the format: `Bearer <your_token>`.

## 🧪 Testing

Run the automated unit test suite to verify business logic and security rules:
```bash
npm run test
```

## 📂 Project Structure

```text
src/
├── auth/           # JWT Authentication, Guards, Strategies, and Tests
├── applicants/     # Core CRUD logic, DTOs, Business Rules, and Tests
├── dashboard/      # Analytics and summary statistics
├── prisma/         # Database connection, schema, and seed script
└── main.ts         # Application entry point, global pipes, and Swagger setup
```
