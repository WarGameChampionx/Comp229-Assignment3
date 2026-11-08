# COMP229 Assignment 3 — Full-Stack Portfolio

A full-stack portfolio application developed using React, Node.js, Express, MongoDB, and Mongoose.

## Features

- Six portfolio pages: Home, About Me, Projects, Education, Services, and Contact Me.
- User registration and sign-in using JWT authentication.
- Password hashing using bcrypt.
- Administrator and regular-user roles.
- Protected administrator dashboard.
- Create, read, update, and delete operations for projects, qualifications, and contacts.
- Contact form submissions saved to MongoDB.
- Loading, validation, success, and error feedback.
- Role-based authorization enforced by the backend.

## Technologies

**Frontend:** React, Vite, React Router, JavaScript, CSS

**Backend:** Node.js, Express, Mongoose

**Database:** MongoDB Atlas

**Authentication:** JSON Web Tokens (JWT), bcryptjs

## Installation

Install Node.js and configure access to MongoDB.

Clone the repository and open the project directory:

```cmd
git clone https://github.com/WarGameChampionx/Comp229-Assignment3.git
cd Comp229-Assignment3
```

Install dependencies:

```cmd
npm install
cd client
npm install
cd ..
```

## Environment Configuration

Create a `.env` file in the project root and configure:

```dotenv
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_jwt_secret
PORT=5000

ADMIN_NAME="Portfolio Administrator"
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="your_secure_administrator_password"
```

Do not commit `.env` or disclose credentials.

## Administrator Seeding

Create the administrator account by running:

```cmd
node server/seed-admin.js
```

The administrator password is securely hashed before being stored in MongoDB.

## Running the Application

From the project root, execute:

```cmd
npm run dev
```

The application uses:

- React frontend: `http://localhost:5173`
- Express backend: `http://localhost:5000`

## REST API Endpoints

Authentication:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/me` — requires authentication

Projects:

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects` — administrator only
- `PUT /api/projects/:id` — administrator only
- `DELETE /api/projects/:id` — administrator only

Qualifications:

- `GET /api/qualifications`
- `GET /api/qualifications/:id`
- `POST /api/qualifications` — administrator only
- `PUT /api/qualifications/:id` — administrator only
- `DELETE /api/qualifications/:id` — administrator only

Contacts:

- `POST /api/contacts` — public contact submission
- `GET /api/contacts` — administrator only
- `GET /api/contacts/:id` — administrator only
- `PUT /api/contacts/:id` — administrator only
- `DELETE /api/contacts/:id` — administrator only

## Authentication and Authorization

The backend issues JWT access tokens after successful sign-in. Tokens expire after one hour.

The frontend stores the token and user information in browser `sessionStorage`. Authenticated API requests include the token using the `Authorization: Bearer` header.

The backend validates the JWT and retrieves the authenticated user from MongoDB. Administrative operations require the `admin` role.

Newly registered users receive the `user` role by default.

### Sign-Out

Signing out removes the JWT and user information from browser `sessionStorage` and clears React authentication state.

The application uses stateless JWT authentication without server-side token revocation. An already-issued token remains valid until expiration, even after the browser signs out.

Tokens stored in `sessionStorage` may be accessible to malicious JavaScript if an XSS vulnerability exists. The application avoids rendering untrusted HTML.

## Testing

The application was tested for:

- Successful registration and sign-in.
- Administrator authentication and protected routes.
- Rejection of unauthenticated requests with HTTP 401.
- Rejection of regular-user administrative operations with HTTP 403.
- Project, qualification, and contact CRUD operations.
- MongoDB persistence.
- Frontend form submission and validation.
- Production build using `npm run build --prefix client`.

## Submission

The submission includes the complete project source code, the GitHub repository link, and a Word document containing screenshots and explanations of the application's functionality.