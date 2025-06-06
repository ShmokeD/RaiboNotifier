import { Job } from "./models/notif.model.js";
import { verifyUserEmail} from './dispatcher/verify.email.dispatcher.js';
import { welcomeUserEmail } from './dispatcher/welcome.email.dispatcher.js';
const enqueueJob = async (req, res) => {
    try{
        const { recievers , task, channel } = req.body;

        const job = new Job({recievers, channel, task});

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
    console.log("Processing Job", job.task);

    switch (job.task) {
case 'verify-user-email':
    await verifyUserEmail(job);
        break;
case 'user-welcome':
    await welcomeUserEmail(job);
    break;
case 'order-placed':
    // TODO: handle order-placed
    break;
case 'out-for-delivery':
    // TODO: handle out-for-delivery
    break;
case 'delivered':
    // TODO: handle delivered
    break;
case 'verify-company-email':
    // TODO: handle verify-company-email
    break;
case 'kyc-start':
    // TODO: handle kyc-start
    break;
case 'kyc-complete':
    // TODO: handle kyc-complete
    break;
case 'product-added':
    // TODO: handle product-added
    break;
case 'product-modified':
    // TODO: handle product-modified
    break;
case 'product-purchased-by-user':
    // TODO: handle product-purchased-by-user
    break;
case 'product-pickedup':
    // TODO: handle product-pickedup
    break;
case 'product-delivered':
    // TODO: handle product-delivered
    break;
case 'customer-review':
    // TODO: handle customer-review
    break;
case 'product-dispute':
    // TODO: handle product-dispute
    break;

        default:

            console.error("Unknown job type:", job.task);
            break;
    }



    // sendMail(job.recievers, job.task);
    // job.status = 'sent';
    // job.updatedAt = new Date();
    // await job.save();
}

export  { enqueueJob, processQueue };
