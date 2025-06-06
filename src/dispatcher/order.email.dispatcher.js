import { User } from '../models/user.model.js';
import { transporter } from './email.dispatcher.js';
import { renderTemplate } from '../utils/renderer.js';

async function orderPlacedEmail(job) {
    const { recievers } = job;

    try {
        const user = await User.findById(recievers[0], 'email fullname');
        if (!user) {
            console.error("User not found for id:", recievers[0]);
            return;
        }

        const email = user.email;
        const name = user.fullname;
        const html = await renderTemplate('order-placed', { name });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
            to: email,
            subject: "Your Order Has Been Placed!!",
            html
        });

        console.log(`Sent Mail to ${info.messageId}`);

    }
    catch (err) {
        console.error("Error while sending verification email", err);
    };

}
async function outForDeliveryEmail(job) {
    const { recievers } = job;

    try {
        const user = await User.findById(recievers[0], 'email fullname');
        if (!user) {
            console.error("User not found for id:", recievers[0]);
            return;
        }

        const email = user.email;
        const name = user.fullname;
        const html = await renderTemplate('out-for-delivery', { name });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
            to: email,
            subject: "Your Order is out for delivery!",
            html
        });

        console.log(`Sent Mail to ${info.messageId}`);

    }
    catch (err) {
        console.error("Error while sending verification email", err);
    };

}
async function orderDeliveredEmail(job) {
    const { recievers } = job;

    try {
        const user = await User.findById(recievers[0], 'email fullname');
        if (!user) {
            console.error("User not found for id:", recievers[0]);
            return;
        }

        const email = user.email;
        const name = user.fullname;
        const html = await renderTemplate('delivered', { name });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
            to: email,
            subject: "Your Order Has Been Delivered!!",
            html
        });

        console.log(`Sent Mail to ${info.messageId}`);

    }
    catch (err) {
        console.error("Error while sending verification email", err);
    };

}


export { outForDeliveryEmail, orderDeliveredEmail, orderPlacedEmail };
