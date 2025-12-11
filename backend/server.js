// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// routers
const courtsRouter = require('./routes/courts');
const bookingsRouter = require('./routes/bookings');
const adminRouter = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

// mount routes
app.use('/api/courts', courtsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

// health
app.get('/', (req, res) => res.json({ success: true, message: 'Badminton Booking Backend' }));

const PORT = process.env.PORT || 4000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    // sync without force by default
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
