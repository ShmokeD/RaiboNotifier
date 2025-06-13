import {Router} from "express";

const router = Router();


import { processMessage , enqueueJob} from "../job.handler.js";
router.post('/publish', processMessage);
router.post('/enqueue', enqueueJob);

export default router;
