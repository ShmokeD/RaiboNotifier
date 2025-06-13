import './config/env.config.js'; //ensure config is loaded first
import app from './app.js';
import connectDB from './db/index.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Service running at port:", process.env.PORT || 8000);
    });

})
.catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});
