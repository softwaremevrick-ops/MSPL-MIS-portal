require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Middleware
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/activities', require('./routes/activities'));
app.use('/inventory', require('./routes/inventory'));
app.use('/users', require('./routes/users'));

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Fallback for 404 - Not Found
app.use(notFound);
// Error handling for all other errors
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`MIS Backend running at http://localhost:${port}`);
});
