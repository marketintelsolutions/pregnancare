const { saveUserDetails, generateCode } = require("../middleware/user");
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const db = require("../auth/firebase");
const bcrypt = require('bcrypt');


const transporter = nodemailer.createTransport({
    service: 'gmail', // use your email service here
    auth: {
        user: 'mail.pacholdings@gmail.com',
        pass: 'zwveytcpxozeopyx'   // replace with your email password
    }
});

exports.saveUser = async (req, res) => {
    console.log('request made');
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

        // Delete any existing code for the user
        const codesRef = db.collection('codes');
        const snapshot = await codesRef.where('email', '==', userData.email).get();

        snapshot.forEach(doc => {
            doc.ref.delete();
        });

        // Store code in the database with a timestamp and user email
        const codeData = {
            email: userData.email,  // Storing user email with code
            code,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await codesRef.add(codeData);

        await saveUserDetails(userData);
        console.log('user saved and code sent');
        res.status(200).send('User saved successfully and code sent');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error saving user');
    }
}

exports.resendCode = async (req, res) => {
    console.log('request made');
    try {
        const { email } = req.body;
        const code = generateCode();

        // Send code to user's email
        await transporter.sendMail({
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Your 5-digit code',
            text: `Your code is: ${code}`
        });

        // Delete any existing code for the user
        const codesRef = db.collection('codes');
        const snapshot = await codesRef.where('email', '==', email).get();

        snapshot.forEach(doc => {
            doc.ref.delete();
        });

        // Store code in the database with a timestamp and user email
        const codeData = {
            email,  // Storing user email with code
            code,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        await codesRef.add(codeData);

        console.log('code sent');
        res.status(200).send('code sent');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error sending code');
    }
}


exports.verifyCode = async (req, res) => {
    const { code } = req.body;
    const codeRef = await db.collection('codes').where('code', '==', code).get();

    if (!codeRef.empty) {
        const codeDoc = codeRef.docs[0];
        const codeData = codeDoc.data();
        const now = admin.firestore.Timestamp.now();
        const differenceInMinutes = (now.seconds - codeData.timestamp.seconds) / 60;

        if (differenceInMinutes <= 5) {
            // If code is valid, delete it after validation
            await codeDoc.ref.delete();
            console.log('valid code and code deleted');
            res.status(200).send('Code is valid');
        } else {
            // If code has expired, you might also want to delete it. 
            // It depends on your use-case. If you want to delete expired codes:
            // await codeDoc.ref.delete();
            console.log('Code has expired');
            res.status(400).send('Code has expired');
        }
    } else {
        res.status(400).send('Invalid code');
    }
}

exports.storePassword = async (req, res) => {
    console.log('request made');
    const { password, email } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store in Firebase Cloud Firestore
        const usersRef = db.collection('users');
        const userSnapshot = await usersRef.where('email', '==', email).get();

        if (!userSnapshot.empty) {
            // User already exists, update the password
            const userId = userSnapshot.docs[0].id;
            await usersRef.doc(userId).update({ password: hashedPassword });
        } else {
            // // New user, add to Firestore
            // await usersRef.add({
            //     email,
            //     password: hashedPassword
            // });

            res.status(404).json({ success: false, message: 'User does not exist or email invalid' });
        }

        console.log('password saved');
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error storing password.' });
    }
}
