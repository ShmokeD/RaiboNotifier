import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "sendgrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});


export { transporter }
