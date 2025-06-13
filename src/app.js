import express from 'express';
import { transporter } from './dispatcher/email.dispatcher.js';

const app = express();


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({express: true, limit: "16kb"}))

await transporter.verify();
console.log("Ready to Send Mail");

import notifRoutes from './routes/notif.routes.js';
app.use('/api/v1/notif', notifRoutes);




export default app;
