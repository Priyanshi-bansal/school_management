import nodemailer from 'nodemailer';
import {config} from '../config.js';

const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: config.email.smtpPort,
  secure: config.email.smtpSecure,
  auth: {
    user: config.email.smtpUser,
    pass: config.email.smtpPass
  }
});

export const sendEmailWithAttachment = async ({ to, subject, text, attachments }) => {
  try {
    const mailOptions = {
      from: `"School Management" <${config.email.from}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text,
      attachments
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

