const mysql = require('mysql2/promise');
require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');


app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
const routes = require('./routes');
app.use('/api', routes);

async function initializeApp() {
    try {
        // Create database if it doesn't exist
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });

        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database '${process.env.DB_NAME}' ready`);
        await connection.end();

        // Now import models and sync
        const db = require('./models');

        await db.sequelize.sync({ alter: true });
        console.log('All tables synced successfully');

        // Start your server here
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

initializeApp();