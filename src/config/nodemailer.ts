import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
  service:"gmail",
  host:"smtp.gmail.com",
  port:465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD,
  },
});

// Send an email using async/await
async function sendMail(emailAddress:string, subject:string, html:string) {
    console.log("Sending email to:", emailAddress);
    console.log("Email subject:", subject);
    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emailAddress,
    subject: subject,
    html: html,
  });

};


export { transporter, sendMail}

// function sendMail(){
// // for development and testing purposes, we can use nodemailer's built-in test account
// nodemailer.createTestAccount((err, account) => {
//   if (err) {
//     console.error("Failed to create a testing account. " + err.message);
//     return;
//   }

//   // Create a transporter using the Ethereal test account credentials
//   const transporter = nodemailer.createTransport({
//     host: account.smtp.host,
//     port: account.smtp.port,
//     secure: account.smtp.secure,
//     auth: {
//       user: account.user,
//       pass: account.pass,
//     },
//   });

//   // Send a test message
 
//     transporter
//     .sendMail({
//       from: "Example App <no-reply@example.com>",
//       to: "user@example.com",
//       subject: "Hello from tests",
//       text: "This message was sent from a Node.js integration test.",
//     })
//     .then((info) => {
//       console.log("Message sent: %s", info.messageId);
//       // Get a URL to preview the message in Ethereal's web interface
//       console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     })
//     .catch(console.error);

// })

// }
// export { sendMail}
