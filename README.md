# Vulnerable Web Application for SAST Testing

A deliberately insecure web application built with Node.js, Express, Next.js, and PostgreSQL. Designed to test Static Application Security Testing (SAST) tools and train developers on security vulnerabilities.

## ⚠️ WARNING
**DO NOT DEPLOY THIS TO PRODUCTION.** 
It contains multiple critical security vulnerabilities including SQL Injection, Command Injection, and Arbitrary File Upload/Read.

## Structure
- `/backend`: Node.js Express API
- `/frontend`: Next.js React UI
- `docker-compose.yml`: PostgreSQL database

## Getting Started

### Prerequisites
- Node.js (v16+)
- Docker & Docker Compose
- npm

### Installation

1. **Start the Database**
   ```bash
   docker-compose up -d
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Initialize DB and Seed Data (Run this after DB is healthy)
   node src/utils/initDb.js
   # Start Server
   npm start
   ```
   Backend runs on `http://localhost:3001`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## Scanning
Run your SAST tool against the entire repository. Check `VULNERABILITIES.md` to see what should be detected.

## Manual Exploitation
1. **SQLi**: Go to Login, use `' OR '1'='1` as username.
2. **XSS**: Register with `<img src=x onerror=alert(1)>` as Bio, then login.
3. **Command Injection**: Go to Admin, enter `127.0.0.1; ls -la` in Ping host.
4. **Race Condition**: Use Wallet to transfer funds, try automated concurrent requests.
