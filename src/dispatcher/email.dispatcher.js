import nodemailer from "nodemailer";
import mongoose, { Mongoose } from "mongoose";
import { User } from '../models/user.model.js';
import { Merchant } from '../models/merchant.model.js';
import { renderTemplate } from '../utils/renderer.js';

const transporter = nodemailer.createTransport({
  service: "sendgrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});


async function sendUserMail(job, subject)
{
     const { recievers, values } = job;

        try {
            // Since recievers is an array with a single ObjectId, get the first element
            const user = await User.findById(recievers[0], 'email fullname');

            if (!user) {
                console.error("User not found for id:", recievers[0]);
                return;
            }

            

            const email = user.email;
            const html = await renderTemplate(job.task, values);

            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
                to: email,
                subject: subject,
                html
            });


        }
        catch (err) {
            console.error("Error while sending verification email", err);
        }
}

async function sendMerchantMail(job, subject)
{

  const { recievers, values , task} = job;

      try {
          const merchant = await Merchant.findById(recievers[0], 'users name');
          if (!merchant) {
              console.error("Merchant not found for id:", recievers[0]);
              return;
          }

          //TODO: Role should be changable

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

          for (const user of users) {
              const email = user.email;
              const name = user.fullname;
              const html = await renderTemplate(task, values);

              const info = await transporter.sendMail({
                  from: process.env.EMAIL_FROM || 'shmokedev@gmail.com',
                  to: email,
                  subject: subject,
                  html
              });

              console.log(`Sent Mail to ${info.messageId}`);
          }
      }
      catch (err) {
          console.error("Error while sending verification email", err);
      };

}
export { transporter, sendUserMail, sendMerchantMail };
