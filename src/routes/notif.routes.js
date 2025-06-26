import {Router} from "express";

const router = Router();


import { processMessage , enqueueJob, publishTestMessage} from "../job.handler.js";
router.post('/publish', processMessage);
router.post('/enqueue', enqueueJob);

if (process.env.NODE_ENV === 'development') {
    console.log('Dev Mode Enabled');
    router.get('/publishTestMessage', publishTestMessage)
}

export default router;
