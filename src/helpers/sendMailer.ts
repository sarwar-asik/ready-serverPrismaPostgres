import nodemailer from 'nodemailer';
import config from '../config';

export async function senMailer(subject: string, to: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com.',   //!  gmail host and port for smtp
    port: 587,   //!  port for smtp
    // secure: true,
    auth: {
      user: config.nodeMailer.FromEmail, //! owner email
      pass: config.nodeMailer.appPassword,
    },
  });

  await transporter.sendMail({
    from: config.nodeMailer.FromEmail,
    to,
    subject,
    // text: 'Hello world?',
    html,
  });
}
