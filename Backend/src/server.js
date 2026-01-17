import express from 'express';
import { ENV } from './lib/env.js';
import { connectDB } from './lib/db.js';

const app = express();

app.get('/', (req, res) => {
    res.json('backend is running correctly');
});




// starting the server with DB connection alongwith error handling
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT,() => {
        console.log(`Server is running on port: ${ENV.PORT} `);
        });

    } catch (error) {
        console.log("error starting server:", error.message);
    }

};
startServer();