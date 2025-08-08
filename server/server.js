
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const bookingsFile = path.join(__dirname, 'bookings.json');
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, '[]');

app.post('/api/book', (req, res) => {
  const { date, time, type } = req.body;
  if (!date || !time || !type) return res.status(400).json({ success: false, message: "Missing data" });

  const bookings = JSON.parse(fs.readFileSync(bookingsFile));
  const existing = bookings.find(b => b.date === date && b.time === time);
  if (existing) return res.json({ success: false, message: "Time slot already booked!" });

  bookings.push({ date, time, type });
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
