import { Job } from "./models/notif.model.js";
import {asyncHandler} from './utils/asyncHandler.js';
import {sendMerchantMail, sendUserMail} from "./dispatcher/email.dispatcher.js";

const enqueueJob = asyncHandler(async (req, res) => {
    try{
        const { recievers , task, channel , values} = req.body;

        const job = new Job({recievers, channel, task, values});

        await job.save();
        res.status(201).json({id: job._id});
    }
    catch (error)
    {
        res.status(500).json({error: error.message});
    }

});


const processMessage = asyncHandler(async (req,res) => //Processes Message sent by pub/sub
{
    try{
        const data = req.body.message.data; //pubsub data encoded in base64
        const decodedData = Buffer.from(data,"base64").toString(); //decode the data into json
        const dataObject = JSON.parse(decodedData); //convert into json dataObject

        const {jobId} = dataObject;

         const job = await Job.findByIdAndUpdate( jobId,
            { status: "processing", updatedAt: new Date() },
            { sort: { createdAt: 1 }, new: true }
        );

        if(job)
        {
            dispatch(job);
        }
        res.status(200).send();
    }

    catch(error)
    {
        console.error("ERROR Processing publish:", error);
        res.status(500).send();
    }
});

async function dispatch(job)
{
    console.log("Processing Job", job.task);

    switch (job.task) {
case 'verify-user-email':
    await sendUserMail(job, "Verify Your Email");
    break;
case 'user-welcome':
    await sendUserMail(job, "Welcome to Raibo!!");
    break;
case 'order-placed':
    await sendUserMail(job, "Your Order Has Been Placed!!");
    break;
case 'out-for-delivery':
    await sendUserMail(job, "Your Order is Out for Delivery!!");
    break;
case 'delivered':
    await sendUserMail(job, "Your Order Has Been Delivered!!");
    break;

    //Seller
case 'verify-company-email':
    await sendMerchantMail(job, "Verify Your Company Email");
    break;
case 'kyc-start':
    await sendMerchantMail(job, 'Your KYC form has been submitted');
    break;
case 'kyc-complete':
    await sendMerchantMail(job, 'Your KYC form has been approved');
    break;
case 'product-added':
    await sendMerchantMail(job, 'Your Product has been added');
    break;
case 'product-modified':
    await sendMerchantMail(job, 'Product has been modified');
    break;
case 'product-purchased-by-user':
    await sendMerchantMail(job, 'Product has been purchased by user');
    break;
case 'product-pickedup':
    await sendMerchantMail(job, 'Product has been picked up');
    break;
case 'product-delivered':
    await sendMerchantMail(job, 'Product has been delivered');
    break;
case 'customer-review':
    await sendMerchantMail(job, 'Your Product has a new review');
    break;
case 'product-dispute':
    await sendMerchantMail(job, 'A dispute has been raised for your product');
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

export  { enqueueJob , processMessage};
