const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Sample data for demonstration purposes
const orders = [
  { id: 1, customer: 'John Doe', total: 50 },
  { id: 2, customer: 'Jane Smith', total: 75 },
  { id: 3, customer: 'Mike Johnson', total: 100 },
];

const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
];

// Route to fetch orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Route to fetch customers
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// Start the server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});
