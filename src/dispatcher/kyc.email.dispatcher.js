import { Merchant } from "../models/merchant.model.js";
import { User } from "../models/user.model.js";

async function kycStartedEmail(job)
{
    const {recievers } = job;

    try {
        const merchant = await Merchant.findById(recievers[0], 'users name');
        if (!merchant) {
            console.error("Merchant not found for id:", recievers[0]);
            return;
        }

        const adminUserIds = merchant.users
            .filter(u => u.role === 'admin')
            .map(u => u.user);

        if (!adminUserIds.length) {
            console.error("No admin users found for merchant:", merchant._id);
            return;
        }

        const users = await User.find({ _id: { $in: adminUserIds } });
        if (!users.length) {
            console.error("No user documents found for admin user IDs:", adminUserIds);
            return;
        }
//TODO: Test this :p
        for (const user of users) {
            const email = user.email;
            const name = user.fullname;
            const html = await renderTemplate('kyc-start', { name });

            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
                to: email,
                subject: "Your Company's KYC has been initiated!!",
                html
            });

            console.log(`Sent Mail to ${info.messageId}`);
        }
    }
    catch (err) {
        console.error("Error while sending verification email", err);
    };
}

async function kycCompleteEmail(job)
{
    const {recievers } = job;

    try {
        const merchant = await Merchant.findById(recievers[0], 'users name');
        if (!merchant) {
            console.error("Merchant not found for id:", recievers[0]);
            return;
        }

        const adminUserIds = merchant.users
            .filter(u => u.role === 'admin')
            .map(u => u.user);

        if (!adminUserIds.length) {
            console.error("No admin users found for merchant:", merchant._id);
            return;
        }

        const users = await User.find({ _id: { $in: adminUserIds } });
        if (!users.length) {
            console.error("No user documents found for admin user IDs:", adminUserIds);
            return;
        }
//TODO: Test this :p
        for (const user of users) {
            const email = user.email;
            const name = user.fullname;
            const html = await renderTemplate('kyc-complete', { name });

            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
                to: email,
                subject: "Your Company's KYC has been completed!!",
                html
            });

            console.log(`Sent Mail to ${info.messageId}`);
        }
    }
    catch (err) {
        console.error("Error while sending verification email", err);
    };
}

export { kycCompleteEmail, kycStartedEmail};
