# 📚 The Bookshelf - Java + React Bookstore

> **PHP project ko Java Spring Boot + React mein convert kiya gaya**
> AWS pe deploy karne ke liye ready

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    AWS Cloud                         │
│                                                      │
│  ┌──────────────┐    HTTP/REST    ┌───────────────┐  │
│  │   Frontend   │ ─────────────► │    Backend    │  │
│  │  React.js    │                │  Spring Boot  │  │
│  │  (S3 +       │ ◄───────────── │  Java 17      │  │
│  │  CloudFront) │    JSON API    │  (EC2)        │  │
│  └──────────────┘                └───────┬───────┘  │
│                                          │           │
│                                          ▼           │
│                                  ┌───────────────┐   │
│                                  │  AWS RDS      │   │
│                                  │  MySQL 8.0    │   │
│                                  └───────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
bookstore/
├── backend/                        ← Java Spring Boot
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/bookstore/
│       ├── BookstoreApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java  (JWT + CORS)
│       │   └── WebMvcConfig.java    (Static files)
│       ├── controller/
│       │   ├── AuthController.java      (Login/Register)
│       │   ├── ProductController.java   (Books CRUD)
│       │   ├── CartController.java      (Cart)
│       │   ├── OrderController.java     (Orders)
│       │   ├── MessageController.java   (Contact)
│       │   └── AdminController.java     (Users list)
│       ├── service/         (Business logic)
│       ├── repository/      (JPA/DB queries)
│       ├── model/           (User, Product, Cart, Order, Message)
│       ├── dto/             (Request/Response objects)
│       ├── security/        (JWT Util + Filter)
│       └── exception/       (Global error handler)
│
├── frontend/                       ← React.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── App.js            (Routing)
│       ├── context/
│       │   └── AuthContext.js  (Global auth state)
│       ├── services/
│       │   └── api.js          (All API calls - Axios)
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── user/
│       │   │   ├── Home.js
│       │   │   ├── Shop.js
│       │   │   ├── Cart.js
│       │   │   ├── Checkout.js
│       │   │   ├── Orders.js
│       │   │   ├── About.js
│       │   │   └── Contact.js
│       │   └── admin/
│       │       ├── AdminDashboard.js
│       │       ├── AdminProducts.js
│       │       ├── AdminOrders.js
│       │       ├── AdminMessages.js
│       │       └── AdminUsers.js
│       └── components/
│           ├── common/
│           │   ├── Navbar.js
│           │   ├── Footer.js
│           │   └── Toast.js
│           └── admin/
│               └── AdminSidebar.js
│
├── docker-compose.yml          ← Local development
├── deploy-backend-ec2.sh       ← EC2 deployment
├── deploy-frontend-s3.sh       ← S3 deployment
├── rds-init.sql                ← Database setup
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Option A: Docker Compose (Sabse Aasaan)
```bash
# 1. Project clone/copy karo
cd bookstore

# 2. Ek command mein sab start karo
docker-compose up --build

# App ready ho jayega:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8080
# Database: localhost:3306
```

### Option B: Manual (Without Docker)

**Backend:**
```bash
cd backend

# MySQL locally run karo aur .env set karo
export DB_HOST=localhost
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
export DB_NAME=books
export JWT_SECRET=your-256-bit-secret-key-here

mvn spring-boot:run
# Backend: http://localhost:8080
```

**Frontend:**
```bash
cd frontend
npm install

# .env mein backend URL set karo
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env

npm start
# Frontend: http://localhost:3000
```

---

## ☁️ AWS Deployment (Step-by-Step)

### Step 1: RDS MySQL Setup
1. AWS Console → RDS → Create Database
2. Engine: **MySQL 8.0**
3. Template: Free Tier
4. DB name: `books`
5. Username: `admin`, Password: (strong password)
6. VPC: Same as EC2
7. **Public access: No**
8. Security Group: EC2 se port **3306** allow karo

9. RDS create hone ke baad **Endpoint** copy karo
   ```
   bookstore-db.xxxxx.ap-south-1.rds.amazonaws.com
   ```

10. MySQL client se connect karke init script run karo:
    ```bash
    mysql -h YOUR_RDS_ENDPOINT -u admin -p < rds-init.sql
    ```

---

### Step 2: EC2 Backend Deploy

1. EC2 launch karo: **Ubuntu 22.04, t3.micro**
2. Security Group mein **port 8080** open karo (Inbound)
3. EC2 mein SSH karo:
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_EC2_IP
   ```

4. Backend code upload karo:
   ```bash
   scp -r -i your-key.pem backend/ ubuntu@YOUR_EC2_IP:~/bookstore/
   ```

5. Deploy script run karo:
   ```bash
   chmod +x deploy-backend-ec2.sh
   ./deploy-backend-ec2.sh
   ```

6. `.env` mein RDS details daalo:
   ```bash
   sudo nano /opt/bookstore/.env
   ```
   ```
   DB_HOST=YOUR_RDS_ENDPOINT
   DB_PASSWORD=YOUR_RDS_PASSWORD
   JWT_SECRET=your-very-strong-secret
   FRONTEND_URL=https://your-cloudfront-url.cloudfront.net
   ```

7. Service restart karo:
   ```bash
   sudo systemctl restart bookstore
   sudo systemctl status bookstore
   ```

---

### Step 3: S3 Frontend Deploy

1. `deploy-frontend-s3.sh` mein apni values daalo:
   ```bash
   S3_BUCKET="bookstore-frontend-yourname"
   BACKEND_URL="http://YOUR_EC2_IP:8080/api"
   ```

2. Script run karo:
   ```bash
   chmod +x deploy-frontend-s3.sh
   ./deploy-frontend-s3.sh
   ```

3. (Optional) CloudFront setup karo HTTPS ke liye:
   - AWS Console → CloudFront → Create Distribution
   - Origin: S3 website URL
   - Redirect HTTP → HTTPS
   - Custom error: 404 → /index.html (200)

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/products` | Public | All products |
| GET | `/api/products/featured` | Public | 6 products |
| POST | `/api/admin/products` | Admin | Add product |
| PUT | `/api/admin/products/{id}` | Admin | Update product |
| DELETE | `/api/admin/products/{id}` | Admin | Delete product |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart` | User | Add to cart |
| PUT | `/api/cart/{id}` | User | Update qty |
| DELETE | `/api/cart/{id}` | User | Remove item |
| DELETE | `/api/cart` | User | Clear cart |
| GET | `/api/orders` | User | My orders |
| POST | `/api/orders` | User | Place order |
| GET | `/api/admin/orders` | Admin | All orders |
| PUT | `/api/admin/orders/{id}/status` | Admin | Update status |
| POST | `/api/messages` | User | Send message |
| GET | `/api/admin/messages` | Admin | All messages |
| GET | `/api/admin/users` | Admin | All users |

---

## 🔒 Default Admin Login
```
Email:    admin@bookstore.com
Password: admin123
```
> ⚠️ **Production mein password zaroor change karo!**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security + JWT |
| Database | MySQL 8 (AWS RDS) |
| Frontend | React 18, React Router v6 |
| HTTP Client | Axios |
| Styling | Custom CSS (original se inspired) |
| Backend Deploy | AWS EC2 |
| Frontend Deploy | AWS S3 + CloudFront |
| Containerization | Docker + Docker Compose |
