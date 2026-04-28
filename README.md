# 🎫 IT Helpdesk Ticket Management System

A full-stack IT support ticket management system built with **React**, **Node.js**, **Express**, and **MongoDB**. Employees can raise tickets, agents manage and resolve them, and admins get full analytics oversight.

---

## 🚀 Features

### 👤 User
- Register & login with JWT authentication
- Raise support tickets (title, description, category, priority)
- View only their own tickets
- Add comments / chat on tickets
- Rate resolved tickets (1–5 stars)

### 🛠️ Agent
- View all tickets assigned to them
- Update ticket status: `Open → In Progress → Resolved`
- Reply to user comments

### 🔑 Admin
- View **all** tickets across the system
- Assign tickets to agents
- Advanced filtering & saved filter presets
- Full analytics dashboard (charts, SLA breach alerts)

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose (in-memory for dev) |
| Auth | JWT + bcrypt |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |

---

## 📁 Project Structure

```
helpdesk-app/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Charts/      # Recharts chart components
│   │   │   ├── Navbar.jsx
│   │   │   ├── TicketCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── SLATimer.jsx
│   │   │   └── FeedbackModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateTicket.jsx
│   │   │   ├── TicketDetail.jsx
│   │   │   ├── AdminTickets.jsx
│   │   │   └── AdminAnalytics.jsx
│   │   └── App.jsx
│   └── vite.config.js
│
└── server/                  # Node.js backend
    ├── controllers/         # Route handlers
    ├── models/              # Mongoose schemas
    │   ├── User.js
    │   └── Ticket.js        # Includes SLA pre-save hook
    ├── routes/              # Express routers
    ├── middleware/
    │   └── authMiddleware.js  # JWT protect + RBAC authorize
    └── server.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm

> **Note:** This project uses `mongodb-memory-server` — no local MongoDB installation required! The database spins up automatically. Data resets on server restart.

### 1. Clone the repo
```bash
git clone https://github.com/alok-singh304/IT-Helpdesk.git
cd IT-Helpdesk/helpdesk-app
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Configure Environment
Create a `.env` file inside `/server`:
```env
PORT=5005
MONGO_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your_super_secret_key
```

### 4. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 5. Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open your browser at **http://localhost:3000** 🎉

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |

### Tickets
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/tickets` | All roles (filtered by role) |
| POST | `/api/tickets` | All authenticated users |
| GET | `/api/tickets/:id` | All roles |
| PUT | `/api/tickets/:id` | Agent, Admin |
| POST | `/api/tickets/:id/comment` | All roles |
| POST | `/api/tickets/:id/rate` | User only |
| GET | `/api/tickets/breached` | Admin only |

### Analytics (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/by-status` | Ticket count by status |
| GET | `/api/analytics/tickets-per-day` | Daily ticket trends |
| GET | `/api/analytics/agent-performance` | Resolved count per agent |

---

## 📊 SLA Policy

Deadlines are automatically calculated on ticket creation:

| Priority | SLA Deadline |
|----------|-------------|
| 🔴 High | 2 hours |
| 🟡 Medium | 24 hours |
| 🟢 Low | 72 hours |

Breached tickets are highlighted in the Admin Analytics dashboard.

---

## 🧪 Quick Test Guide

1. Register 3 accounts with roles: `user`, `agent`, `admin`
2. As **user** → raise a ticket
3. As **admin** → assign the ticket to the agent
4. As **agent** → update status to `In Progress` → `Resolved`
5. As **user** → rate the resolved ticket ⭐
6. As **admin** → view the Analytics Dashboard 📊

---

## 📄 License

MIT License — free to use and modify.

---

> Built with ❤️ using React + Node.js + MongoDB
