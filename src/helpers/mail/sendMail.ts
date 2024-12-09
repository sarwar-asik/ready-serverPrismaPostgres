import nodemailer from 'nodemailer';

import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/ApiError';

export type IEmailOptions = {
  email: string;
  subject: string;
  // template: string;
  // data?: { [key: string]: any };
  html: any;
  text?: string;
};
export async function sendEmailFunc(options: IEmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: parseInt(config.smtp.port as string),
      // secure: false,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass,
      },
    });

    await transporter.sendMail({
      from: config.smtp.auth.user,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not sent');
  }
}
