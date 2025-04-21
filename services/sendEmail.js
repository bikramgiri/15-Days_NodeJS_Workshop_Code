// *Useful in all project

const nodeemailer = require('nodemailer');

// var options = {
//       email: "",
//       subject: "",
//       otp: "" 
// };
// options.email

const sendEmail = async (options) => {
      try {
            var transporter = nodeemailer.createTransport({
                  service: 'gmail',  // or yahoo, outlook, etc.
                  // or
                  // host: 'smtp.gmail.com',
                  // port: 465, // 465
                  auth: {
                  user: process.env.EMAIL,
                  pass: process.env.EMAIL_PASSWORD,
                  },
            });
            const mailOptions = {
                  from: "Bikram Giri <process.env.EMAIL>",
                  to: options.email,
                  subject: options.subject,
                  text: "Your OTP is " + options.otp,
            };
      
            await transporter.sendMail(mailOptions);
      } catch (error) {
            console.error('Error sending email:', error);
      }
      };
      
      module.exports = sendEmail;