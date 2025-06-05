import nodemailer from "nodemailer";
import {User} from '../models/user.model.js';

const transporter = nodemailer.createTransport({
  service: "sendgrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});

async function sendMail(receivers, message) {

  try {
    // Fetch users whose _id is in the receivers array
    const users = await User.find({ _id: { $in: receivers } }, 'email');
    const emails = users.map(user => user.email).filter(Boolean);

    if (emails.length === 0) {
        throw new Error('No valid email addresses found for the provided user IDs.');
    }

    const info = await transporter.sendMail({
      from: 'shmokedev@gmail.com', // sender address
      to: emails, // list of receivers
      subject: "Hello", // Subject line
      text: message, // plain text body
      html: `<b>${message}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
}

export { transporter , sendMail}
