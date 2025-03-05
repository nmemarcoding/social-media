// simple express server with mongodb connection using .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/posts', require('./routes/post'));
app.use('/api/comments', require('./routes/comment'));

app.use('/api/messages', require('./routes/message'));

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("DB Connection Successfull!"))
    .catch((err) => {
        console.log(err);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);