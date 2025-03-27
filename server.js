const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Mock database
let users = [
  { id: 1, email: 'user@example.com', password: 'password123', name: 'Demo User', balance: 25000 }
];

let transactions = [];

// API Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/transfer', (req, res) => {
  const { amount, recipient, description } = req.body;
  transactions.push({
    id: transactions.length + 1,
    amount,
    recipient,
    description,
    date: new Date().toISOString()
  });
  res.json({ success: true });
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});