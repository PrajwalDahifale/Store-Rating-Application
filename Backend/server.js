// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const ratingRoutes = require('./routes/ratings');
const adminRoutes = require('./routes/admin');

app.use(cors());
app.use(express.json());

// API versioning 
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Store Rating API running'));

// error handler 
app.use((err, req, res, next) => {
    console.error(err.stack);
  
    // If the error has a status code, use it
    const statusCode = err.status || 500;
  
    // If it's a validation error from express-validator
    if (err.errors) {
      return res.status(400).json({
        message: 'Validation error',
        errors: err.errors
      });
    }
  
    // For custom application errors
    if (err.type === 'db') {
      return res.status(500).json({
        message: 'Database error',
        details: err.message
      });
    }
  
    if (err.type === 'auth') {
      return res.status(401).json({
        message: 'Unauthorized',
        details: err.message
      });
    }
  
    // Fallback for unhandled errors
    res.status(statusCode).json({
      message: err.message || 'Server error'
    });
  });
  

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
