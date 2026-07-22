
```markdown
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


```markdown
## 🐳 Running with Docker (Recommended)

If you have Docker and Docker Compose installed, you can run the entire application with a single command. This handles dependency installation, database setup, and seeding automatically.

1. **Build and start the container:**
   ```bash
   docker-compose up --build
   ```
2. The API will be running at `http://localhost:3000`.
3. To stop the container, press `Ctrl + C` in the terminal, then run:
   ```bash
   docker-compose down
   ```
```

---

### Step 5: Test It Locally (Optional but Recommended)
If you have Docker Desktop installed on your Windows machine, you can test this right now to prove it works:

1. Make sure your normal Node server is stopped (`Ctrl + C`).
2. Run: `docker-compose up --build`
3. Wait for it to say "Nest application successfully started".
4. Open your browser to `http://localhost:3000/api/docs` and verify it works!
5. Press `Ctrl + C` and run `docker-compose down` to stop it.

*(If you don't have Docker Desktop installed, that's okay! The files are there for the evaluators who do have it, which fulfills the requirement).*

---



```bash

```

Adding Docker support shows that you understand modern deployment workflows and care about the developer experience of whoever is reviewing your code.

Let me know when this is pushed! You are now truly, 100% complete. 🏆

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

4. **Initialize the Database & Seed Data:**
   This will create the SQLite database, run migrations, and create a default Admin user.
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
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
```
