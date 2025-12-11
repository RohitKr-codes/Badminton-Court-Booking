🏸 Badminton Court Booking System

Welcome to the Badminton Court Booking System – a modern, interactive, and fully-featured platform to manage court bookings, coaches, equipment, and pricing rules with live availability and dynamic pricing. This project is built for a seamless booking experience, both for users and administrators.


🌟 Key Features
User-Facing Features

Book courts for desired time slots with real-time availability.

Optional coaches can be selected for personalized training.

Equipment booking included (rackets, shoes) with automatic pricing.

Live pricing and detailed breakdown of total cost.

Filter courts by type (indoor/outdoor) and availability.

Interactive booking modal for a smooth user experience.

Admin Dashboard

Add/Edit/Delete courts, coaches, equipment, and pricing rules.

Live updates: newly added items are instantly reflected in the booking system.

Dynamic pricing rules (peak hours, weekends, fixed surcharges, court type-based rules).

Track bookings and manage reservations with ease.

Professional UI with a clean, responsive layout.



⚡ Technology Stack

Layer	Technology
Frontend	React, Vite, JSX, CSS
Backend	Node.js, Express
Database	SQLite (via Sequelize ORM)
API Communication	Axios
Date Handling	JavaScript Date API
State Management	React useState, useEffect, useMemo


📂 Project Structure
badminton-booking/
├── backend
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers for bookings and admin operations
│   ├── models/          # Sequelize models: Court, Coach, Equipment, Booking, PricingRule
│   ├── routes/          # Express routes
│   ├── utils/           # Price calculator logic
│   ├── seed/            # Seed scripts for initial data
│   ├── server.js        # Express server entry point
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── pages/       # BookingPage, AdminDashboard, AdminBooking
│   │   ├── components/  # BookingModal, SlotGrid, PriceBreakdown, BookingsTable
│   │   ├── services/    # API calls via Axios
│   │   └── styles/      # Global CSS
│   ├── index.html
│   ├── main.jsx
│   └── App.jsx
│
└── README.md

🎨 User Interface

Admin Dashboard:
Beautiful cards for courts, coaches, equipment, and pricing rules. Add, edit, or delete entries with instant feedback.

Booking Page:
Intuitive grid for court availability. Select slots, add optional coach, equipment, and view live price breakdown in real time.

Booking Modal:
Compact, professional modal with live cost computation, including coach fees and equipment.

⚙ How to Run Locally
Backend

Navigate to the backend folder:

cd backend


Install dependencies:

npm install


Setup .env file (database credentials, port, etc.).

Seed the database (optional):

node seed/seed.js


Start the server:

node server.js


Backend will run on http://localhost:4000.

Frontend

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev


Open the app in your browser at http://localhost:5173 (default Vite port).

🛠 Functionality Highlights

Dynamic Equipment & Coach Selection: All newly added equipment or coaches appear immediately in the booking modal.

Pricing Rules Engine: Apply multipliers, surcharges, and fixed rules based on court type, time, and weekends.

Interactive Booking Table: Visualize all bookings with easy-to-read grid and status indicators (free/booked).

Responsive Design: Works seamlessly on desktop and tablet devices.

💡 Future Enhancements

Multi-day booking with recurring schedules.

User authentication and personalized booking history.

Notification system (email/SMS) for booking confirmation.

Analytics dashboard for admin insights.

👨‍💻 Contributing

This project is open for enhancements and experimentation. Contributions are welcome to improve features, UI, and performance.

📄 License

MIT License – free to use, modify, and deploy.



Enjoy seamless badminton booking with live updates, dynamic pricing, and professional UI! 🏸