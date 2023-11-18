const { saveUserDetails, generateCode, updateUserByEmail, getUserByEmail, transporter } = require("../middleware/authMiddleware");
const admin = require('firebase-admin');
const db = require("../auth/firebase");
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const fs = require('fs');

// const getAuth = () => admin.auth();

const bucket = admin.storage().bucket('images');

exports.saveUser = async (req, res) => {
    console.log('request made');
    try {
        const userData = req.body;
        const code = generateCode();

        // Check if email already exists in the database
        const usersRef = db.collection('users'); // assuming 'users' is the name of your user collection
        const emailSnapshot = await usersRef.where('email', '==', userData.email).get();

        if (!emailSnapshot.empty) {
            console.log('Email already in use');
            return res.status(400).send('Email already in use');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // use your email service here
            auth: {
                user: `mail.pacholdings@gmail.com`,
                pass: `zwveytcpxozeopyx`  // replace with your email password
            }
        });

        console.log(process.env.EMAIL_APP_TOKEN);

        // Send code to user's email
        if (userData.email) {
            await transporter.sendMail({
                from: 'your-email@gmail.com',
                to: userData.email,
                subject: 'Your 5-digit code',
                text: `Your code is: ${code}`
            });
        }

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

            // Fetch updated user data
            const updatedUserDoc = await usersRef.doc(userId).get();
            userData = updatedUserDoc.data();
        }

        console.log('password saved');
        res.status(200).json({ success: true, user: userData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: 'Error storing password.' });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user by email from Firebase Firestore
        const users = await admin.firestore().collection('users').where('email', '==', email).get();
        if (users.empty) {
            return res.status(400).json({ message: 'Email and/or Password is Invalid' });
        }

        const user = users.docs[0].data();

        // Check password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email and/or Password is Invalid' });
        }

        // If everything's okay, send a positive response
        res.status(200).json({ message: 'Logged in successfully', user: user }); // Adjust the response as needed.

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.resetEmail = async (req, res) => {
    const { email } = req.body;

    const userSnapshot = await getUserByEmail(req.body.email);

    // if (!userSnapshot.exists) return res.status(404).send('No user with that email');
    if (userSnapshot.empty) return res.status(404).send('No user with that email');

    // const user = userSnapshot.data();

    // Generate a token
    const token = crypto.randomBytes(20).toString('hex');
    const updates = {
        passwordResetToken: token,
        passwordResetExpires: Date.now() + 3600000 // 1 hour
    };

    await updateUserByEmail(req.body.email, updates);

    // Send the email (using nodemailer for example)
    mailtransporter = nodemailer.createTransport({
        service: 'gmail', // use your email service here
        auth: {
            user: `mail.pacholdings@gmail.com`,
            pass: `zwveytcpxozeopyx`  // replace with your email password
        }
    });

    const mailOptions = {
        to: email,
        from: 'passwordreset@example.com',
        subject: 'Password Reset',
        text: 'Click this link to reset your password: ' + process.env.RESET_PASSWORD_BASE_URL + token
    };
    mailtransporter.sendMail(mailOptions, (err) => {
        res.send('Reset password link sent');
    });
}

exports.resetPassword = async (req, res) => {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('passwordResetToken', '==', req.params.token).get();

    if (snapshot.empty) return res.status(400).send('Token invalid');

    const user = snapshot.docs[0];
    if (user.data().passwordResetExpires <= Date.now()) {
        return res.status(400).send('Token expired');
    }

    // console.log('email', user.data().email);
    const email = user.data().email

    const password = req.body.newPassword

    const hashedPassword = await bcrypt.hash(password, 10);

    const updates = {
        password: hashedPassword, // Make sure to hash the password!
        passwordResetToken: admin.firestore.FieldValue.delete(),
        passwordResetExpires: admin.firestore.FieldValue.delete()
    };

    await updateUserByEmail(email, updates);

    res.send('Password reset successful');
}


exports.logout = async (req, res) => {
    try {
        // Get the user ID using the email address
        const { email } = req.body;
        const usersRef = admin.firestore().collection('users');
        const userSnapshot = await usersRef.where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(400).json({ message: 'User not found with the provided email address' });
        }

        const userId = userSnapshot.docs[0].id;

        // Get the user data for additional operations
        const userData = userSnapshot.docs[0].data();

        // Update the user's status and remove sosRideId
        await admin.firestore().collection('users').doc(userId).update({
            sos: false,
            sosRideId: null,
        });

        // Additional feature: Check and cancel the ride
        if (userData.sosRideId) {
            const ridesRef = admin.firestore().collection('rides');
            // const rideSnapshot = await ridesRef.doc(userData.sosRideId).get();
            const rideSnapshot = await ridesRef.where('rideId', '==', userData.sosRideId).get();

            if (!rideSnapshot.empty) {
                console.log('ride exists');
                const rideData = rideSnapshot.docs[0].data();

                // Set the ride status to 'cancelled'
                await ridesRef.doc(rideSnapshot.docs[0].id).update({ status: 'cancelled' });

                // Additional feature: Check and update driver status
                if (rideData.assignedDriver) {
                    // const driverSnapshot = await usersRef.doc(rideData.assignedDriver).get();
                    const driverSnapshot = await usersRef.where('email', '==', rideData.assignedDriver.email).get();

                    if (!driverSnapshot.empty) {
                        console.log('there is assigned driver');
                        // Update the driver's sos status to false
                        await usersRef.doc(driverSnapshot.docs[0].id).update({ sos: false });
                    }
                }
            } else {
                console.log('ride not found');
            }
        }

        // Send a positive response
        res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}




