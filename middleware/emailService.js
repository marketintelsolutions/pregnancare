// emailService.js
const nodemailer = require('nodemailer');

const sendVerificationCode = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // use your email service here
        auth: {
            user: `mail.pacholdings@gmail.com`,
            pass: `zwveytcpxozeopyx`  // replace with your email password
        }
    });

    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your 5-digit code',
        text: `Your code is: ${code}`
    });
};

module.exports = {
    sendVerificationCode,
};
