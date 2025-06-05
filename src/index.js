import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/index.js';
import { processQueue } from './job.handler.js';



dotenv.config({path: './env'});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server running at port:", process.env.PORT || 8000);
    });

    processQueue();
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});
