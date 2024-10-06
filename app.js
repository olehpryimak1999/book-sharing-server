require('dotenv').config();
require('express-async-errors');

const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const instanceRoutes = require('./routes/instanceRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = 3000;
const API_PREFIX = '/api';

app.use(cors());
app.use(express.json())
app.use(authMiddleware.authenticate);
app.use(`${API_PREFIX}/user`, userRoutes);
app.use(`${API_PREFIX}/book`, bookRoutes);
app.use(`${API_PREFIX}/instance`, instanceRoutes);

app.use((err, req, res) => {
    res.status(500).send('Server error');
});

app.listen(PORT, (error) =>{
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    } else
        console.log("Error occurred, server can't start", error);
    }
);