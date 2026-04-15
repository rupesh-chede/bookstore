# 📚 The Bookshelf — Online Bookstore

A full-stack bookstore web application converted from PHP to a modern **Java Spring Boot** backend and **React.js** frontend, ready for deployment on AWS.

![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)
![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS%20%7C%20S3-orange?logo=amazonaws)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [AWS Deployment](#-aws-deployment)
- [API Reference](#-api-reference)
- [Default Credentials](#-default-credentials)
- [Environment Variables](#-environment-variables)

---

## ✨ Features

**User Side**
- Register and login with JWT authentication
- Browse all books on the shop page
- Search books by name
- Add books to cart, update quantity, remove items
- Place orders with delivery details and payment method
- View order history and payment status

**Admin Panel**
- Dashboard with stats (products, orders, messages, revenue)
- Add, edit, and delete books with image upload
- View and manage all customer orders
- Update payment status (pending → completed)
- View and delete customer messages
- View all registered users

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        AWS Cloud                         │
│                                                          │
│  ┌─────────────────┐   REST API   ┌──────────────────┐  │
│  │   Frontend      │ ──────────►  │    Backend       │  │
│  │   React.js      │              │  Spring Boot     │  │
│  │   S3 +          │ ◄──────────  │  Java 17         │  │
│  │   CloudFront    │   JSON       │  EC2 Instance    │  │
│  └─────────────────┘              └────────┬─────────┘  │
│                                            │             │
│                                            ▼             │
│                                   ┌──────────────────┐   │
│                                   │   AWS RDS        │   │
│                                   │   MySQL 8.0      │   │
│                                   └──────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
bookstore/
├── backend/                            # Java Spring Boot
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/bookstore/
│       ├── BookstoreApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java     # JWT + CORS configuration
│       │   └── WebMvcConfig.java       # Static file serving
│       ├── controller/
│       │   ├── AuthController.java     # Register / Login
│       │   ├── ProductController.java  # Books CRUD
│       │   ├── CartController.java     # Cart management
│       │   ├── OrderController.java    # Order placement & admin
│       │   ├── MessageController.java  # Contact form
│       │   └── AdminController.java    # Admin user list
│       ├── service/                    # Business logic layer
│       ├── repository/                 # Spring Data JPA repositories
│       ├── model/                      # JPA entities
│       │   ├── User.java
│       │   ├── Product.java
│       │   ├── Cart.java
│       │   ├── Order.java
│       │   └── Message.java
│       ├── dto/                        # Request / Response objects
│       ├── security/                   # JWT filter and utility
│       └── exception/                  # Global exception handler
│
├── frontend/                           # React.js
│   ├── Dockerfile
│   ├── nginx.conf                      # Nginx config for SPA routing
│   ├── package.json
│   └── src/
│       ├── App.js                      # Route definitions
│       ├── App.css                     # Global styles
│       ├── index.js
│       ├── context/
│       │   └── AuthContext.js          # Global auth state (JWT)
│       ├── services/
│       │   └── api.js                  # All Axios API calls
│       ├── components/
│       │   ├── common/
│       │   │   ├── Navbar.js
│       │   │   ├── Footer.js
│       │   │   └── Toast.js
│       │   └── admin/
│       │       └── AdminSidebar.js
│       └── pages/
│           ├── Login.js
│           ├── Register.js
│           ├── user/
│           │   ├── Home.js
│           │   ├── Shop.js
│           │   ├── Cart.js
│           │   ├── Checkout.js
│           │   ├── Orders.js
│           │   ├── About.js
│           │   └── Contact.js
│           └── admin/
│               ├── AdminDashboard.js
│               ├── AdminProducts.js
│               ├── AdminOrders.js
│               ├── AdminMessages.js
│               └── AdminUsers.js
│
├── docker-compose.yml                  # Local development (all-in-one)
├── deploy-backend-ec2.sh               # AWS EC2 deployment script
├── deploy-frontend-s3.sh               # AWS S3 deployment script
├── rds-init.sql                        # Database initialization script
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Language | Java 17 |
| Backend Framework | Spring Boot 3.2 |
| Authentication | Spring Security + JWT (jjwt 0.11) |
| Database ORM | Spring Data JPA / Hibernate |
| Database | MySQL 8.0 |
| Password Hashing | BCrypt |
| Frontend | React 18, React Router v6 |
| HTTP Client | Axios |
| Frontend Server | Nginx (Alpine) |
| Containerization | Docker, Docker Compose |
| Cloud — Backend | AWS EC2 |
| Cloud — Frontend | AWS S3 + CloudFront |
| Cloud — Database | AWS RDS (MySQL) |

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

### Run Locally with Docker Compose

This is the easiest way to run the entire project with a single command.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/bookstore.git
cd bookstore

# 2. Start all services (backend + frontend + MySQL)
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| MySQL | localhost:3306 |

### Run Without Docker

**Backend**

```bash
cd backend

# Set environment variables
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=books
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=your-256-bit-secret-key
export FRONTEND_URL=http://localhost:3000

# Run
mvn spring-boot:run
```

**Frontend**

```bash
cd frontend

# Install dependencies
npm install

# Set backend URL
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env

# Start development server
npm start
```

---

## ☁️ AWS Deployment

### Step 1 — Set Up AWS RDS (MySQL)

1. Go to **AWS Console → RDS → Create Database**
2. Settings:
   - Engine: **MySQL 8.0**
   - Template: Free Tier
   - DB instance identifier: `bookstore-db`
   - Master username: `admin`
   - Master password: *(choose a strong password)*
   - Initial database name: `books`
   - VPC: Same as your EC2 instance
   - Public access: **No**
3. After creation, note the **Endpoint URL**:
   ```
   bookstore-db.xxxxxxxx.ap-south-1.rds.amazonaws.com
   ```
4. Connect and initialize the database:
   ```bash
   mysql -h YOUR_RDS_ENDPOINT -u admin -p < rds-init.sql
   ```

---

### Step 2 — Deploy Backend to EC2

1. Launch an EC2 instance: **Ubuntu 22.04 LTS, t3.micro**
2. In the Security Group, open **port 8080** (inbound, TCP)
3. Copy the backend code to EC2:
   ```bash
   scp -r -i your-key.pem backend/ ubuntu@YOUR_EC2_IP:~/bookstore/
   scp -i your-key.pem deploy-backend-ec2.sh ubuntu@YOUR_EC2_IP:~/
   ```
4. SSH into the instance and run the deploy script:
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_EC2_IP
   chmod +x deploy-backend-ec2.sh
   ./deploy-backend-ec2.sh
   ```
5. Update the environment file with your RDS details:
   ```bash
   sudo nano /opt/bookstore/.env
   ```
   ```env
   DB_HOST=YOUR_RDS_ENDPOINT
   DB_PASSWORD=YOUR_RDS_PASSWORD
   JWT_SECRET=your-very-strong-256-bit-secret
   FRONTEND_URL=https://your-cloudfront-url.cloudfront.net
   ```
6. Restart the service:
   ```bash
   sudo systemctl restart bookstore
   sudo systemctl status bookstore
   ```

---

### Step 3 — Deploy Frontend to S3

1. Edit `deploy-frontend-s3.sh` and set your values:
   ```bash
   S3_BUCKET="bookstore-frontend-yourname"
   AWS_REGION="ap-south-1"
   BACKEND_URL="http://YOUR_EC2_PUBLIC_IP:8080/api"
   ```
2. Run the script:
   ```bash
   chmod +x deploy-frontend-s3.sh
   ./deploy-frontend-s3.sh
   ```
3. *(Optional)* Set up **CloudFront** for HTTPS:
   - Go to **AWS Console → CloudFront → Create Distribution**
   - Origin: your S3 website URL
   - Viewer Protocol Policy: **Redirect HTTP to HTTPS**
   - Custom error response: `404` → `/index.html` (HTTP 200)

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | Public | Get all products |
| `GET` | `/api/products/featured` | Public | Get 6 featured products |
| `POST` | `/api/admin/products` | Admin | Add a new product (multipart) |
| `PUT` | `/api/admin/products/{id}` | Admin | Update a product |
| `DELETE` | `/api/admin/products/{id}` | Admin | Delete a product |

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/cart` | User | Get current user's cart |
| `POST` | `/api/cart` | User | Add item to cart |
| `PUT` | `/api/cart/{id}` | User | Update item quantity |
| `DELETE` | `/api/cart/{id}` | User | Remove a single item |
| `DELETE` | `/api/cart` | User | Clear entire cart |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/orders` | User | Get current user's orders |
| `POST` | `/api/orders` | User | Place a new order |
| `GET` | `/api/admin/orders` | Admin | Get all orders |
| `PUT` | `/api/admin/orders/{id}/status` | Admin | Update payment status |
| `DELETE` | `/api/admin/orders/{id}` | Admin | Delete an order |

### Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/messages` | User | Send a contact message |
| `GET` | `/api/admin/messages` | Admin | Get all messages |
| `DELETE` | `/api/admin/messages/{id}` | Admin | Delete a message |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/users` | Admin | Get all registered users |

---

## 🔑 Default Credentials

After running `rds-init.sql`, a default admin account is created:

| Field | Value |
|-------|-------|
| Email | `admin@bookstore.com` |
| Password | `admin123` |
| Role | Admin |

> ⚠️ **Change the default admin password immediately after first login in a production environment.**

---

## 🔧 Environment Variables

### Backend (`/opt/bookstore/.env` on EC2)

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | RDS MySQL endpoint | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `books` |
| `DB_USERNAME` | Database user | `root` |
| `DB_PASSWORD` | Database password | *(empty)* |
| `JWT_SECRET` | Secret key for signing JWTs (min 256-bit) | — |
| `JWT_EXPIRATION` | Token expiry in milliseconds | `86400000` (24h) |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `UPLOAD_DIR` | Directory for uploaded images | `./uploads` |
| `PORT` | Server port | `8080` |

### Frontend (`.env` file)

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API base URL |

---

## 🗄️ Database Schema

```sql
register    -- Users (id, name, email, password, user_type)
products    -- Books (id, name, price, image)
cart        -- Cart items (id, user_id, name, price, quantity, image)
orders      -- Orders (id, user_id, name, number, email, method,
            --         address, total_products, total_price,
            --         placed_on, payment_status)
message     -- Contact messages (id, user_id, name, email, number, message)
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up --build

# Start in background
docker compose up -d --build

# Stop all services
docker compose down

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart a single service
docker compose restart backend

# Remove volumes (reset database)
docker compose down -v
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
