import {Router} from "express";

const router = Router();


import { enqueueJob } from "../job.handler.js";
router.post('/publish', enqueueJob);
export default router;
