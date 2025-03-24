const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_PASSWORD,
      },
    })
  
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    }
  
    const info = await transporter.sendMail(message)
  
    console.log("Message is sent successfully!!!")
  }
  
  module.exports = sendEmail
