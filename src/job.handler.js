import { sendMail } from "./dispatcher/email.dispatcher.js";
import { Job } from "./models/notif.model.js";

const enqueueJob = async (req, res) => {
    try{
        const { recievers , message, channel } = req.body;

        const job = new Job({recievers, channel,message});

        await job.save();
        res.status(201).json({id: job._id});
    }
    catch (error)
    {
        res.status(500).json({error: error.message});
    }

};


async function processQueue()
{
    console.log("Started Queue Processing");
    setInterval(async () => {
        const job = await Job.findOneAndUpdate(
            { status: "pending" },
            { status: "processing", updatedAt: new Date() },
            { sort: { createdAt: 1 }, new: true }
        );

        if (job) {
            dispatch(job);
        }
    }, 500);
}

async function dispatch(job)
{
    //TODO: Implement this

    console.log("Processing Job", job.message);
    sendMail(job.recievers, job.message);
    job.status = 'sent';
    job.updatedAt = new Date();
    await job.save();
}

export  { enqueueJob, processQueue };
