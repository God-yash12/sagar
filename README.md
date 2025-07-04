<div align="center">

# 🔐 Full Stack Secure Authentication System

*A modern, production-ready authentication platform combining **NestJS** backend with **React + Vite** frontend*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## ✨ Key Features

🔒 **Secure Authentication**  
🔐 **OTP Email Verification**  
🛡️ **Google reCAPTCHA v2**  
🔑 **JWT Token Management**  
👤 **Role-Based Access Control**  
🔄 **Password Reset Flow**  
🗄️ **MongoDB Integration**  

---

## 🏗️ Architecture

<table>
<tr>
<td width="50%">

### 🚀 Backend Stack
- **NestJS** - Enterprise framework
- **MongoDB** - Database with TypeORM
- **JWT** - Secure token authentication
- **Bcrypt** - Password encryption
- **Nodemailer** - Email service
- **Helmet** - Security headers
- **Rate Limiting** - Brute force protection
- **Role Guards** - Access control

</td>
<td width="50%">

### 🎨 Frontend Stack
- **React 19** - Modern UI library
- **Vite** - Lightning-fast bundler
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **React Query** - Data fetching
- **TailwindCSS** - Utility-first styling
- **Google reCAPTCHA v2** - Bot protection
- **Axios** - HTTP client

</td>
</tr>
</table>

---

## 🔥 Feature Highlights

### 🔐 **Authentication Flow**
> **Signup Process**
> - Full name, email, username validation
> - Strong password requirements (8+ chars, mixed case, symbols)
> - Google reCAPTCHA v2 integration
> - OTP email verification (10-minute expiry)

> **Login System**
> - Flexible login (email OR username)
> - JWT Access Token (15 min) + Refresh Token (7 days)
> - Automatic token rotation
> - Secure cookie/header transmission

### 🔄 **Password Recovery**
```
Step 1: Email → OTP Generation
Step 2: OTP Verification
Step 3: New Password Reset
Step 4: Account Reactivation
```

### 🛡️ **Security & Roles**
- **Role-based authorization** (Admin/User)
- **Admin seeding** via CLI command
- **Protected routes** with guard validation
- **Throttling** against brute-force attacks

---

## 🚀 Quick Start

### 📋 Prerequisites
```bash
Node.js >= 18.x
MongoDB >= 6.x
npm or yarn
```

### 🔧 Installation
```bash
# Clone repository
git clone https://github.com/your-org/secure-auth-system.git
cd secure-auth-system
# sagar
