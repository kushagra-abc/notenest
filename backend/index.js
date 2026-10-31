require('dotenv').config();

const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

const startServer = async () => {
    try {
        await connectToMongo();

        app.listen(port, () => {
            console.log(`NoteNest backend listening at http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

startServer();