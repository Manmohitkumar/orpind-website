import nodemailer from "nodemailer";
import { Resend } from "resend";
import config from "./index.js";
import logger from "./logger.js";

let transporter;

async function createTransporter() {
  if (config.nodeEnv === "development") {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    logger.info("Ethereal test email account created", { user: testAccount.user });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: parseInt(process.env.SMTP_PORT, 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    logger.info("SMTP transporter created");
  }
  return transporter;
}

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

async function sendEmail({ to, subject, html, text }) {
  if (config.resendApiKey && resend) {
    try {
      const result = await resend.emails.send({
        from: config.emailFrom,
        to,
        subject,
        html,
        text,
      });
      logger.info("Email sent via Resend", { messageId: result.id, to });
      return { messageId: result.id, provider: "resend" };
    } catch (err) {
      logger.error("Resend email failed", { error: err.message, to });
      throw err;
    }
  }

  if (!transporter) {
    await createTransporter();
  }

  try {
    const info = await transporter.sendMail({
      from: config.emailFrom,
      to,
      subject,
      html,
      text,
    });
    logger.info("Email sent", { messageId: info.messageId, to });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info("Email preview URL", { url: previewUrl });
    }
    return { messageId: info.messageId, previewUrl, provider: "nodemailer" };
  } catch (err) {
    logger.error("Email send failed", { error: err.message, to });
    throw err;
  }
}

export { transporter: createTransporter, sendEmail };
