import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "anonymous.atma.13@gmail.com",
    pass: "ykexkaaodllukemb", // App password
  },
});

const mailOptions = {
  from: "anonymous.atma.13@gmail.com",
  to: "hxankit01@gmail.com", // test with your email
  subject: "Test Email from Node.js",
  text: "If you got this, the mail config is working!",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Send failed:", error);
  }
  console.log("Email sent:", info.response);
});
