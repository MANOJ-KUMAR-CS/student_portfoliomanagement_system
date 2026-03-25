const mySqlConnection = require('./src/config/mySqlDb');
const mongooseConnection = require('./src/config/mongoDb');

const userRoutes = require('./src/routes/userRoutes');
const portfolioRoutes = require('./src/routes/studentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app=express();

// 1. CORS - MUST BE FIRST to handle preflight requests (OPTIONS)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow frontend URL from .env, or fallback to all
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));



// 3. Body parsing
app.use(express.json());

const PORT = process.env.PORT || 5001;



app.use('/user', userRoutes);
app.use('/student', portfolioRoutes);
app.use('/admin' , adminRoutes);

app.listen(PORT , ()=>{
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Diagnostic: If you see 'Incoming request' logs above, the server is receiving traffic.`);
})