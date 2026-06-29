require('dotenv').config();

const express = require('express');

const cors = require('cors');

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  '/api/users',
  require('./routes/userRoutes')
);

app.use(
  '/api/transactions',
  require('./routes/transactionRoutes')
);

app.use(
  '/api/reminders',
  require('./routes/reminderRoutes')
);

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server Running on Port ${PORT}`
  );

});