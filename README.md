# 🏸 Badminton Court Booking System

**Welcome to the Badminton Court Booking System** – a modern, interactive, and fully-featured platform designed for seamless management of court bookings, coaches, equipment, and dynamic pricing rules.

Built with a focus on **live availability** and a **professional user experience**, this system caters perfectly to both players and facility administrators.

---

## 🌟 Key Features

### 👤 User-Facing Experience

* **Real-Time Booking:** Book courts for desired time slots with **live availability updates**.
* **Optional Services:** Select personalized **coaching** and rent **equipment** (rackets, shoes) during booking.
* **Dynamic Pricing:** View **live pricing** and a detailed breakdown of the total cost before checkout.
* **Intuitive Filters:** Easily filter courts by type (indoor/outdoor) and current availability.
* **Smooth UI:** Interactive booking modal for a fast and efficient process.

### ⚙️ Admin Dashboard

* **Comprehensive Management:** CRUD (Create, Read, Update, Delete) operations for **courts, coaches, equipment, and pricing rules**.
* **Live Updates:** New items are instantly reflected in the user-facing booking system.
* **Dynamic Pricing Engine:** Implement complex rules like **peak hours, weekend surcharges,** and court type-specific pricing.
* **Reservation Tracking:** Effortlessly manage and track all active and past bookings.
* **Professional Layout:** Clean, responsive, and easy-to-navigate interface.

---

## ⚡ Technology Stack

This project is structured using a robust **MERN-like stack** (using Node.js/Express and SQLite instead of MongoDB).

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | `React`, `Vite`, `JSX`, `CSS` | Fast development environment with a modern component-based UI. |
| **Backend** | `Node.js`, `Express` | High-performance, unopinionated backend server. |
| **Database** | `SQLite` (via `Sequelize ORM`) | Lightweight, file-based SQL database for easy setup. |
| **API** | `Axios` | Promise-based HTTP client for seamless communication. |
| **State** | `React useState`, `useEffect`, `useMemo` | Efficient local state and performance optimization. |

---
## 📂 Project Structure

A clear separation of concerns ensures maintainability and scalability.
```
badminton-booking/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers for bookings and admin operations
│   ├── models/          # Sequelize models: Court, Coach, Equipment, Booking, PricingRule
│   ├── routes/          # Express routes
│   ├── utils/           # Price calculator logic
│   ├── seed/            # Seed scripts for initial data
│   ├── server.js        # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # BookingPage, AdminDashboard, AdminBooking
│   │   ├── components/  # BookingModal, SlotGrid, PriceBreakdown, BookingsTable
│   │   ├── services/    # API calls via Axios
│   │   └── styles/      # Global CSS
│   ├── index.html
│   ├── main.jsx
│   └── App.jsx
│
└── README.md
```

---


## ⚙️ How to Run Locally

Follow these steps to set up and run the application on your local machine.

### 1. ⬇️ Clone the Repository

```bash
git clone <YOUR_REPO_URL>
cd badminton-booking
```

### 2. 🚀 Backend Setup
The backend handles the API, database operations, and pricing logic.
```
cd backend
npm install
Configuration: Create a .env file for database credentials, port number, etc.
```
Database Seeding (Optional): Populate the database with initial dummy data:
node seed/seed.js

Start the Server:
```
node server.js
# Backend runs on http://localhost:4000

```
### 3. 🖥️ Frontend Setup
The frontend is built with React and Vite for a fast and interactive interface.

```
cd ../frontend
npm install
Start the Development Server:

npm run dev
# Frontend opens on http://localhost:5173 (default Vite port)
```

---
## 🛠 Functionality Highlights
* Instant Updates: Newly added services (equipment/coaches) are instantly visible in the user booking flow without a server restart.

* Sophisticated Pricing: The centralized Pricing Rules Engine allows for granular control over booking costs based on multiple factors simultaneously.

* Interactive Slot Grid: A clear, color-coded grid visualizes court availability for easy selection.

* Responsive Design: Optimized to work flawlessly across desktop, tablet, and mobile devices.

---

## 💡 Future Enhancements (Roadmap)
We plan to implement the following features to expand the system's capabilities:

🔒 User Authentication: Dedicated sign-up/login and personalized booking history.

📅 Recurring Bookings: Support for multi-day and recurring scheduled reservations.

🔔 Notification System: Email/SMS for booking confirmations, cancellations, and reminders.

📊 Analytics Dashboard: Admin insights on peak times, revenue, and popular services.


---
## 🤝 Contributing
We welcome contributions to enhance the features, improve the UI, or boost performance!

1. Fork the repository.

2. Create a new feature branch (git checkout -b feature/AmazingFeature).

3. Commit your changes (git commit -m 'Add some AmazingFeature').

4. Push to the branch (git push origin feature/AmazingFeature).

5. Open a Pull Request.

---

## 📄 License
Distributed under the MIT License. See LICENSE for more information.
Enjoy seamless badminton booking with live updates, dynamic pricing, and a professional UI! 🏸



