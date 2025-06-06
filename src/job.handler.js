import { Job } from "./models/notif.model.js";
import { verifyUserEmail} from './dispatcher/verify.email.dispatcher.js';
import { welcomeUserEmail } from './dispatcher/welcome.email.dispatcher.js';
import { orderPlacedEmail , outForDeliveryEmail , orderDeliveredEmail } from './dispatcher/order.email.dispatcher.js';
import { kycCompleteEmail, kycStartedEmail} from './dispatcher/kyc.email.dispatcher.js';

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
    await orderPlacedEmail(job);
    break;
case 'out-for-delivery':
    await outForDeliveryEmail(job);
    break;
case 'delivered':
    await orderDeliveredEmail(job);
    break;
case 'verify-company-email':
    await verifyCompanyEmail(job);
    break;
case 'kyc-start':
    await kycStartedEmail(job);
    break;
case 'kyc-complete':
    await kycCompleteEmail(job);
    break;
case 'product-added':
    await productAddedEmail(job);
    break;
case 'product-modified':
    await productModifiedEmail(job);
    break;
case 'product-purchased-by-user':
    await productPurchasedByUserEmail(job);
    break;
case 'product-pickedup':
    await productPickedUpEmail(job);
    break;
case 'product-delivered':
    await productDeliveredEmail(job);
    break;
case 'customer-review':
    await customerReviewEmail(job);
    break;
case 'product-dispute':
    await productDisputeEmail(job);
    break;
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
