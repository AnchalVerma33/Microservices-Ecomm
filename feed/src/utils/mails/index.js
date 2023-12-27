const nodemailer = require("nodemailer");
const { EMAIL_PASS, EMAIL } = require("../../config");

class SendEmail {
  CreateTransporter() {
    return new Promise(async (resolve, reject) => {
      try {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: EMAIL,
            pass: EMAIL_PASS,
          },
        });
        resolve(transporter);
      } catch (e) {
        reject(`Error while creating transported ${e}`);
      }
    });
  }

  sendEmail(message, toMail) {
    return new Promise(async (resolve, reject) => {
      try {
        const transporter = await this.CreateTransporter();
        const mailFormat = {
          from: EMAIL,
          to: toMail,
          subject: "Welcome to our Shopping App - Account Verification",
          text: message,
        };
        const info = await transporter.sendMail(mailFormat);
        resolve(info);
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = SendEmail;
