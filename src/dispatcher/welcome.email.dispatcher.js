import { User } from '../models/user.model.js';
import { transporter } from './email.dispatcher.js';
import { renderTemplate } from '../utils/renderer.js';

async function welcomeUserEmail(job) {
    const { recievers } = job;

    try {
        // Since recievers is an array with a single ObjectId, get the first element
        const user = await User.findById(recievers[0], 'email fullname');
        if (!user) {
            console.error("User not found for id:", recievers[0]);
            return;
        }

        const email = user.email;
        const name = user.fullname;
        const html = await renderTemplate('user-welcome', { name });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
            to: email,
            subject: "Welcome to Raibo!!",
            html
        });

        console.log(`Sent Mail to ${info.messageId}`);

    }
    catch (err) {
        console.error("Error while sending verification email", err);
    };

}
export { welcomeUserEmail };
