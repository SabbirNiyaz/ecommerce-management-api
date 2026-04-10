# 🚀 NestJS E-commerce Backend API

A **scalable RESTful API** built with **NestJS + TypeORM + PostgreSQL** for managing products, product images, authentication, and user profiles with secure **JWT-based authentication** and **role-based authorization**.

---

## 📌 Features

- 🔐 JWT Authentication & Authorization (Seller & Admin)
- 📦 Product CRUD Operations
- 🖼️ Multiple Image Upload System (Multer)
- 👤 User Profile Management
- 🗄️ PostgreSQL Relational Database
- ✅ DTO Validation (class-validator & class-transformer)
- ⚡ Clean & Modular Architecture

---

# 🗄️ Database Relationships

| Relationship | Type | Description |
|-------------|------|------------|
| User → Profile | One-to-One | One user has one profile |
| Profile → User | One-to-One | Profile belongs to one user |
| Product → ProductImage | One-to-Many | One product can have multiple images |
| ProductImage → Product | Many-to-One | Each image belongs to one product |

---

# 📊 Database Tables & Columns (PostgreSQL)

## 👤 Users Table

| Column | Type (PostgreSQL) | Description |
|--------|------------------|------------|
| id | SERIAL (PK) | Primary key |
| name | VARCHAR | User name |
| email | VARCHAR (UNIQUE) | User email |
| password | VARCHAR | User password |
| role | VARCHAR | Role (seller/admin) |

---

## 👤 Profiles Table

| Column | Type (PostgreSQL) | Description |
|--------|------------------|------------|
| id | SERIAL (PK) | Primary key |
| profileImage | VARCHAR | Profile image |
| bio | TEXT | User bio |
| address | TEXT | Address |
| phone | VARCHAR | Phone number |
| isActive | BOOLEAN | Profile status |
| userId | INTEGER (FK) | Reference to Users |

---

## 📦 Products Table

| Column | Type (PostgreSQL) | Description |
|--------|------------------|------------|
| id | SERIAL (PK) | Primary key |
| category | VARCHAR(50) | Product category |
| name | VARCHAR(100) | Product name |
| description | TEXT | Product description |
| price | DECIMAL(10,2) | Product price |
| stock | INTEGER | Available stock |
| status | ENUM | available / out_of_stock |
| createdAt | TIMESTAMP | Created time |
| updatedAt | TIMESTAMP | Updated time |

---

## 🖼️ Product Images Table

| Column | Type (PostgreSQL) | Description |
|--------|------------------|------------|
| id | SERIAL (PK) | Primary key |
| filename | VARCHAR | Stored filename |
| originalName | VARCHAR | Original file name |
| url | VARCHAR | Image URL |
| isPrimary | BOOLEAN | Primary image |
| createdAt | TIMESTAMP | Upload time |
| productId | INTEGER (FK) | Reference to Products |

---

# 📊 API Routes

## 📦 Product Routes

| Method | Endpoint | Description |
|--------|---------|------------|
| GET | `/products` | Get all products |
| GET | `/products/filter?minPrice=&status=` | Filter products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create product (**Seller only**) |
| PUT | `/products/:id` | Update product |
| PATCH | `/products/:id` | Update stock & status |
| DELETE | `/products/:id` | Delete product |

---

## 🖼️ Product Image Routes

| Method | Endpoint | Description |
|--------|---------|------------|
| GET | `/products/images/:filename` | Get image file |
| POST | `/products/:productId/images` | Upload multiple images |
| DELETE | `/products/image/:imageId` | Delete single image |
| DELETE | `/products/:productId/images` | Delete all images |

---

## 🔐 Authentication Routes

| Method | Endpoint | Description |
|--------|---------|------------|
| POST | `/auth/signup` | Register user |
| POST | `/auth/signin` | Login user |

---

## 👤 Profile Routes

| Method | Endpoint | Description |
|--------|---------|------------|
| GET | `/auth/profile` | Get logged-in profile |
| POST | `/auth/profile` | Create profile |
| PUT | `/auth/profile-update` | Update profile |

---

## 🛡️ Admin Route

| Method | Endpoint | Description |
|--------|---------|------------|
| DELETE | `/auth/delete/user/:id` | Delete user (**Admin only**) |

---

# 📥 DTO Validation Rules

## 📦 Product Validation
- Price must be ≥ 1  
- Stock must be ≥ 0  
- Status must be: `available` or `out_of_stock`  

## 🔐 Authentication Validation
- Email must be valid  
- Password must be at least 6 characters  

## 👤 Profile Validation
- Phone must match: `01XXXXXXXXX`  
- Boolean fields must be true/false  

---

# 🔐 Authentication & Authorization

- Uses **JWT Guard** for protected routes  
- Role-based access:
  - **Seller** → Manage products & images  
  - **Admin** → Delete users  

---

# 🖼️ File Upload System

- Supports: JPG, JPEG, PNG, WEBP  
- Max 10 files per request  
- Max 5MB per file  
- Stored in: `src/uploads/products`  

---

# 👨‍💻 Author

**Sabbir Hossain Niyaz**  
🎓 CSE Student, AIUB  
💼 Full Stack Developer  