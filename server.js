const express = require('express');
const connectDB = require('./config/db');
const app = express();

//connecting to database
connectDB();

//Init middleware to use JSON
app.use(express.json( { extended: false } ));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/journals', require('./routes/api/journals'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));