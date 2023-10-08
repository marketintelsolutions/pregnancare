const { saveUserDetails, generateCode } = require("../middleware/user");
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const db = require("../auth/firebase");

const transporter = nodemailer.createTransport({
    service: 'gmail', // use your email service here
    auth: {
        user: 'mail.pacholdings@gmail.com',
        pass: 'zwveytcpxozeopyx'   // replace with your email password
    }
});

exports.saveUser = async (req, res) => {
    console.log('resquest made');
    try {
        const userData = req.body;
        const code = generateCode();

        // Send code to user's email
        await transporter.sendMail({
            from: 'your-email@gmail.com',
            to: userData.email,
            subject: 'Your 5-digit code',
            text: `Your code is: ${code}`
        });

        // Store code in the database with a timestamp
        const codeData = {
            code,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await db.collection('codes').add(codeData);

        await saveUserDetails(userData);
        console.log('user saved and code sent');
        res.status(200).send('User saved successfully and code sent');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error saving user');
    }
}

exports.verifyCode = async (req, res) => {
    const { code } = req.body;
    const codeRef = await db.collection('codes').where('code', '==', code).get();

    if (!codeRef.empty) {
        const codeData = codeRef.docs[0].data();
        const now = admin.firestore.Timestamp.now();
        const differenceInMinutes = (now.seconds - codeData.timestamp.seconds) / 60;

        if (differenceInMinutes <= 5) {
            console.log('valid code');
            res.status(200).send('Code is valid');
        } else {
            res.status(400).send('Code has expired');
        }
    } else {
        res.status(400).send('Invalid code');
    }
}