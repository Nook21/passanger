# SwiftLink — Smart Delivery Connection Platform

SwiftLink is a **modern delivery coordination system** that connects **Senders**, **Carriers**, **Receivers**, and **Support Agents** in one seamless workflow.
Built using **React Native (Expo)** for both **web and mobile**, SwiftLink ensures fast, reliable, and secure parcel delivery — powered by OTP verification and digital payment integration.

---

## Overview

SwiftLink bridges the communication and trust gap between individuals who want to **send**, **carry**, and **receive** items safely.
The system provides real-time coordination, authentication, and tracking through verified phone numbers, ensuring that every delivery is traceable and legitimate.

---

##  User Roles

###  1. Sender

* Registers and verifies via OTP using a **real phone number**.
* Searches for available carriers.
* Sends a **delivery request** by providing receiver details.
* Can track the delivery and payment status.

### 2. Carrier

* Accepts or rejects delivery requests.
* Communicates with senders for pickup and drop-off details.
* Updates delivery status in real-time.

### 3. Receiver

* Receives a **secret verification code** via phone when a sender inputs their number.
* Uses this code to confirm delivery and **validate payment** once the item arrives.

###  4. Agent (Support Staff)

* Handles customer support via the **in-app chat system**.
* Manages user messages and resolves delivery issues in real time.

---

## 🔐 Key Features

 **OTP Verification:**
Every user must verify their real phone number before accessing the platform.

**Chapa Payment Integration:**
SwiftLink supports **secure digital payments** through Chapa for seamless delivery transactions.

**Cross-Platform Support:**
Built using **React Native (Expo)** — runs smoothly on both **mobile devices** and **web browsers**.

**Role-Based Dashboards:**
Different dashboards for each role (Sender, Carrier, Receiver, Agent) ensure a clean and secure user experience.

**Secure Messaging:**
Built-in **real-time chat** between users and support agents.

**Persistent Login:**
Session handling ensures users remain logged in even after refreshing or reopening the app.

**Modern UI/UX:**
A user-friendly, minimal, and responsive design for both mobile and desktop users.

---

## Tech Stack

| Category             | Technology                            |
| -------------------- | ------------------------------------- |
| **Frontend**         | React Native (Expo), React Navigation |
| **Backend**          | Node.js, Express.js                   |
| **Database**         | MongoDB (Mongoose ORM)                |
| **Authentication**   | JWT (JSON Web Tokens)                 |
| **OTP Verification** | Twilio or SMS-based OTP Service       |
| **Payment Gateway**  | Chapa                                 |
| **API Testing**      | Postman                               |
| **Version Control**  | Git & GitHub                          |

---

## System Architecture

```
Client (React Native + Expo)
     │
     ├── Authentication (OTP, JWT)
     │
     ├── Role-based Dashboards
     │
     ├── Secure API Calls → Express Server
     │
     ├── Database (MongoDB)
     │
     └── Payment Gateway (Chapa)
```

---

## Setup & Installation

### 1 Clone the repository:

```bash
git clone https://github.com/selam1630/passange
cd SwiftLink
```

### 2 Install dependencies:

```bash
npm install
```

### 3 Configure Environment Variables:

Create a `.env` file in your backend directory with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CHAPA_SECRET_KEY=your_chapa_secret
```

### 4 Start the Backend:

```bash
cd backend
npm run dev
```

### 4 Start the Frontend:

```bash
cd frontend
npm run web
```

---

##  App Navigation

| Screen                 | Description                              |
| ---------------------- | ---------------------------------------- |
| **Landing Page**       | Entry point for new and returning users. |
| **SignUp & SignIn**    | Authentication using OTP verification.   |
| **Sender Dashboard**   | View and manage delivery requests.       |
| **Carrier Dashboard**  | Accept or reject sender requests.        |
| **Receiver Dashboard** | Confirm deliveries and handle payments.  |
| **Support Chat**       | Real-time chat with an agent.            |
| **Agent Dashboard**    | Handle user messages and issues.         |

---

## 💬 Real-Time Messaging Flow

1. Sender or Receiver sends a message.
2. Message stored in MongoDB with metadata (userId, agentId, status).
3. Agent dashboard fetches and displays unread messages.
4. Agent replies → message updates to “read”.

---

## Payment Workflow (Chapa)

1. Sender initiates a delivery and enters payment details.
2. Chapa API processes and validates the transaction.
3. Receiver confirms item delivery using their **secret verification code**.
4. Payment is then released securely to the carrier.

---

## Future Improvements

* Live package tracking via GPS
* Push notifications
* Delivery history and analytics
* Rating and feedback system for carriers
* AI chat support for faster issue resolution

---

## Contributors

* **Naol Bekele** – Lead Developer & Project Architect
* **Team SwiftLink** – UI Design, Backend Integration, Testing

---

## 📄 License

This project is licensed under the **MIT License** — you’re free to use, modify, and distribute with attribution.
