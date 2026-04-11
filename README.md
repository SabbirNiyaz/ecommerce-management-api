# 🚀 NestJS E-commerce Backend API

A **scalable RESTful API** built with **NestJS + TypeORM + PostgreSQL** for managing products, product images, authentication, and user profiles with secure **JWT-based authentication** and **role-based authorization**.

---

## 📌 Features

- 🔐 JWT Authentication & Authorization (Seller & Admin)
- 🔑 Password Hashing using bcrypt
- 📦 Product CRUD Operations
- 🖼️ Multiple Image Upload System (Multer)
- 👤 User Profile Management
- 🗄️ PostgreSQL Relational Database
- ✉️ Automated Welcome Email System (Nodemailer via NestJS Mailer)
- ✅ DTO Validation (class-validator & class-transformer)
- ⚡ Clean & Modular Architecture
- 🧠 Smart Business Logic (Auto status, validation checks)

---

# ✉️ Email System 

## 📌 Welcome Email on Registration

When a user registers successfully (`/auth/signup`):

- A **welcome email is automatically sent**
- Powered by `@nestjs-modules/mailer`
- Uses **role-based HTML templates**

---

## 📧 Email Features

| Feature | Description |
|--------|------------|
| SMTP Provider | Gmail SMTP |
| Trigger | After successful signup |
| Template System | Role-based (seller / admin) |
| Format | Beautiful HTML email |
| Personalization | User name + role injected dynamically |

---

## 👤 Role-Based Email Templates

### 🟢 Seller Email
- Subject: `Your Seller Account is Ready!`
- Includes:
  - Welcome message
  - Seller dashboard link
  - Selling instructions

---

### 🔵 Admin Email
- Subject: `[Admin] Platform Access Granted`
- Includes:
  - Admin access confirmation
  - Admin panel link
  - Platform control message

---

## ⚙️ Email Configuration (SMTP)

| Config | Value |
|--------|------|
| Host | smtp.gmail.com |
| Port | 465 |
| Secure | true |
| Auth Email | EMAIL_USER (env) |
| Auth Password | EMAIL_APP_PASS (env) |

---

## 🧠 Email Flow

1. User registers (`/auth/signup`)
2. Password is hashed using bcrypt
3. User is saved in PostgreSQL
4. Role is detected (seller/admin)
5. Welcome email template is generated
6. Email is sent via MailerService
7. User data is returned (without password)

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

| Column | Type | Description |
|--------|------|------------|
| id | SERIAL (PK) | Primary key |
| name | VARCHAR | User name |
| email | VARCHAR (UNIQUE) | User email |
| password | VARCHAR | Hashed password (bcrypt) |
| role | VARCHAR | seller / admin |

---

## 👤 Profiles Table

| Column | Type | Description |
|--------|------|------------|
| id | SERIAL (PK) | Primary key |
| profileImage | VARCHAR | Profile image |
| bio | TEXT | User bio |
| address | TEXT | Address |
| phone | VARCHAR | Phone number |
| isActive | BOOLEAN | Profile status |
| userId | INTEGER (FK) | Reference to Users |

---

## 📦 Products Table

| Column | Type | Description |
|--------|------|------------|
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

| Column | Type | Description |
|--------|------|------------|
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
| GET | `/products/filter?minPrice=&status=` | Filter products (dynamic query) |
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
| POST | `/auth/signup` | Register user (sends welcome email) |
| POST | `/auth/signin` | Login user (returns JWT) |

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

# 🧠 Business Logic Highlights

### 🔑 Authentication
- Passwords are hashed using **bcrypt**
- JWT token includes:
  - id, name, email, role

---

### 📦 Product Logic
- Product status is **auto-managed**:
  - `stock < 1 → out_of_stock`
  - `stock ≥ 1 → available`
- Prevents update if **no changes detected**

---

### 🔄 Stock & Status Sync
- If status = `out_of_stock` → stock = 0  
- If stock = 0 → status = `out_of_stock`  

---

### 🔍 Filtering Logic
- Dynamic filtering using:
  - `minPrice`
  - `status`
- Uses **TypeORM MoreThan()**

---

### 🖼️ Image Handling
- First uploaded image becomes **primary image**
- If product not found:
  - Uploaded files are **auto-deleted (cleanup)**
- Image deletion removes:
  - DB record
  - Physical file from storage

---

### 👤 Profile Logic
- One user → only one profile
- Prevent duplicate profile creation
- Prevent update if no changes detected

---

### ❌ Error Handling
- Custom exceptions:
  - NotFoundException
  - UnauthorizedException
  - BadRequestException
- Consistent error responses with HTTP status codes

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