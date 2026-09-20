# Project Management System

A full-stack project management application built using **Spring Boot, React, MySQL, JWT, and WebSocket**.

The application helps users create and manage projects, add project members, create and track tasks, add comments, receive notifications, and view project information through a modern web interface.

## Features

* User Registration and Login
* JWT-based Authentication
* Project Creation and Management
* Project Member Management
* Task Creation and Management
* Task Status Tracking
* Task Comments
* Notifications
* Dashboard
* Real-time Updates using WebSocket
* RESTful APIs
* React-based Frontend
* MySQL Database Integration

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT
* WebSocket / STOMP
* Maven
* MySQL

### Frontend

* React
* TypeScript
* Vite
* Axios
* HTML
* CSS

## Project Architecture

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Entity
    ↓
MySQL Database
```

The application also includes separate security and WebSocket configurations.

## Project Structure

```text
Project-Management-System/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## Backend Modules

The backend contains modules for:

* User Management
* Project Management
* Project Members
* Task Management
* Comments
* Notifications
* Dashboard
* Authentication and Security
* WebSocket Communication

## Authentication

The application uses **JWT (JSON Web Token)** authentication.

Users can register and log in to the application. Protected APIs require a valid JWT token for authentication.

## Real-Time Communication

The application uses **WebSocket with STOMP** to support real-time communication between the frontend and backend.

This allows updates to be received without continuously refreshing the application.

## Database

The application uses **MySQL** for storing:

* Users
* Projects
* Project Members
* Tasks
* Comments
* Notifications

Create the database using:

```sql
CREATE DATABASE project_management;
```

## Getting Started

### Prerequisites

Install the following before running the project:

* Java 24
* Maven
* MySQL
* Node.js
* npm

### 1. Clone the Repository

```bash
git clone https://github.com/afrin782/Project-Management-System.git
cd Project-Management-System
```

### 2. Configure the Backend

Go to:

```text
backend/src/main/resources/
```

Use `application.properties.example` as a reference and create your local `application.properties`.

Configure your:

* MySQL username
* MySQL password
* JWT secret

**Do not commit your real `application.properties` or secret values to GitHub.**

### 3. Start the Backend

Open a terminal inside the `backend` folder:

```bash
cd backend
```

Run:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8088
```

### 4. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend runs on the Vite development server, usually:

```text
http://localhost:5173
```

## API Modules

The backend provides REST APIs for:

* Users
* Projects
* Project Members
* Tasks
* Comments
* Notifications
* Dashboard

WebSocket communication is also available for real-time updates.

## Future Enhancements

* Task priority and filtering
* Project search
* User profile management
* File attachments
* Email notifications
* Improved responsive design
* Production deployment

## Author

**Afrin Fathima Beevi**

GitHub: https://github.com/afrin782

## Repository

GitHub Repository:

https://github.
