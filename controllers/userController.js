const { saveUserDetails, generateCode, updateUserByEmail, getUserByEmail, transporter } = require("../middleware/authMiddleware");
const admin = require('firebase-admin');
const db = require("../auth/firebase");
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const fs = require('fs');
const { sendVerificationCode } = require("../middleware/emailService");
const { saveUser } = require('../middleware/userQueries');
const { connection, withTransaction, executeQuery } = require("../database/db");
const { async } = require("@firebase/util");

// const getAuth = () => admin.auth();

const bucket = admin.storage().bucket('images');

// exports.saveUser = async (req, res) => {
//     console.log('request made');
//     try {
//         const userData = req.body;
//         const code = generateCode();

//         // Check if email already exists in the database
//         const usersRef = db.collection('users'); // assuming 'users' is the name of your user collection
//         const emailSnapshot = await usersRef.where('email', '==', userData.email).get();

//         if (!emailSnapshot.empty) {
//             console.log('Email already in use');
//             return res.status(400).send('Email already in use');
//         }

//         const transporter = nodemailer.createTransport({
//             service: 'gmail', // use your email service here
//             auth: {
//                 user: `mail.pacholdings@gmail.com`,
//                 pass: `zwveytcpxozeopyx`  // replace with your email password
//             }
//         });

//         console.log(process.env.EMAIL_APP_TOKEN);

//         // Send code to user's email
//         if (userData.email) {
//             await transporter.sendMail({
//                 from: 'your-email@gmail.com',
//                 to: userData.email,
//                 subject: 'Your 5-digit code',
//                 text: `Your code is: ${code}`
//             });
//         }

//         // Delete any existing code for the user
//         const codesRef = db.collection('codes');
//         const snapshot = await codesRef.where('email', '==', userData.email).get();

//         snapshot.forEach(doc => {
//             doc.ref.delete();
//         });

//         // Store code in the database with a timestamp and user email
//         const codeData = {
//             email: userData.email,  // Storing user email with code
//             code,
//             timestamp: admin.firestore.FieldValue.serverTimestamp()
//         };

//         await codesRef.add(codeData);

//         await saveUserDetails(userData);
//         console.log('user saved and code sent');
//         res.status(200).send('User saved successfully and code sent');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Error saving user');
//     }
// }

exports.saveUser = async (req, res) => {
    console.log('request made');
    try {
        const userData = req.body;
        const code = generateCode();

        // Send code to user's email
        await sendVerificationCode(userData.email, code);

        // Save user details to the database
        await saveUser(userData, res);

        // Store code in the database with a timestamp and user email
        const insertCodeQuery = 'INSERT INTO codes (email, code, timestamp) VALUES (?, ?, NOW())';
        await connection.query(insertCodeQuery, [userData.email, code]);

        console.log('user saved and code sent');
        res.status(200).send('User saved successfully and code sent');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error saving user');
    }
};

// exports.resendCode = async (req, res) => {
//     console.log('request made');
//     try {
//         const { email } = req.body;
//         const code = generateCode();

//         // Send code to user's email
//         await transporter.sendMail({
//             from: 'your-email@gmail.com',
//             to: email,
//             subject: 'Your 5-digit code',
//             text: `Your code is: ${code}`
//         });

//         // Delete any existing code for the user
//         const codesRef = db.collection('codes');
//         const snapshot = await codesRef.where('email', '==', email).get();

//         snapshot.forEach(doc => {
//             doc.ref.delete();
//         });

//         // Store code in the database with a timestamp and user email
//         const codeData = {
//             email,  // Storing user email with code
//             code,
//             timestamp: admin.firestore.FieldValue.serverTimestamp()
//         };

//         await codesRef.add(codeData);

//         console.log('code sent');
//         res.status(200).send('code sent');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Error sending code');
//     }
// }


// exports.verifyCode = async (req, res) => {
//     const { code } = req.body;
//     const codeRef = await db.collection('codes').where('code', '==', code).get();

//     if (!codeRef.empty) {
//         const codeDoc = codeRef.docs[0];
//         const codeData = codeDoc.data();
//         const now = admin.firestore.Timestamp.now();
//         const differenceInMinutes = (now.seconds - codeData.timestamp.seconds) / 60;

//         if (differenceInMinutes <= 5) {
//             // If code is valid, delete it after validation
//             await codeDoc.ref.delete();
//             console.log('valid code and code deleted');
//             res.status(200).send('Code is valid');
//         } else {
//             // If code has expired, you might also want to delete it. 
//             // It depends on your use-case. If you want to delete expired codes:
//             // await codeDoc.ref.delete();
//             console.log('Code has expired');
//             res.status(400).send('Code has expired');
//         }
//     } else {
//         res.status(400).send('Invalid code');
//     }
// }

exports.resendCode = async (req, res) => {
    console.log('request made');
    try {
        const { email } = req.body;
        const code = generateCode();

        await sendVerificationCode(email, code);

        // Delete any existing code for the user
        const deleteCodeQuery = `DELETE FROM codes WHERE email=?`;
        await connection.query(deleteCodeQuery, [email]);

        // Store code in the database with a timestamp and user email
        const insertCodeQuery = 'INSERT INTO codes (email, code, timestamp) VALUES (?, ?, NOW())';
        await connection.query(insertCodeQuery, [email, code]);

        console.log('code sent');
        res.status(200).send('Code sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending code');
    }
};


exports.verifyCode = async (req, res) => {
    const { code } = req.body;

    console.log(typeof code);

    try {
        // Check if the code exists in the 'codes' table
        const codeQuery = 'SELECT * FROM codes WHERE code = ?';
        const codeResults = await connection.query(codeQuery, code, async (error, results) => {
            if (error) {
                console.log(error);
                console.log('code not found');
                res.status(400).send('Invalid code');
            } else {
                console.log('results', results);
                const codeData = results[0];
                const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
                const differenceInMinutes = (now - codeData.timestamp) / 60;

                if (differenceInMinutes <= 5) {
                    // If code is valid, delete it after validation
                    const deleteCodeQuery = `DELETE FROM codes WHERE code =${code}`;
                    await connection.query(deleteCodeQuery);

                    console.log('Valid code and code deleted');
                    res.status(200).send('Code is valid');
                } else {
                    // If code has expired
                    console.log('Code has expired');
                    res.status(400).send('Code has expired');
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying code');
    }
};


// exports.storePassword = async (req, res) => {
//     console.log('request made');
//     const { password, email } = req.body;

//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Store in Firebase Cloud Firestore
//         const usersRef = db.collection('users');
//         const userSnapshot = await usersRef.where('email', '==', email).get();

//         if (!userSnapshot.empty) {
//             // User already exists, update the password
//             const userId = userSnapshot.docs[0].id;
//             await usersRef.doc(userId).update({ password: hashedPassword });

//             // Fetch updated user data
//             const updatedUserDoc = await usersRef.doc(userId).get();
//             userData = updatedUserDoc.data();
//         }

//         console.log('password saved');
//         res.status(200).json({ success: true, user: userData });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: 'Error storing password.' });
//     }
// }
// exports.storePassword = async (req, res) => {
//     console.log('request made');
//     const { password, email, userType } = req.body;

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Check if the user exists in the MySQL database
//         const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
//         const userResults = await connection.query(selectUserQuery, [email], async (error, results) => {
//             if (error) {
//                 console.log(error);
//                 console.log('User not found');
//                 res.status(404).json({ success: false, message: 'User not found.' });
//             } else {
//                 // User already exists, update the password
//                 const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';
//                 await connection.query(updatePasswordQuery, [hashedPassword, email]);

//                 // Fetch updated user data
//                 const selectUpdatedUserQuery = 'SELECT * FROM users WHERE email = ?';
//                 await connection.query(selectUpdatedUserQuery, [email], (error, results) => {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         const userData = results[0]
//                         res.status(200).json({ success: true, user: userData });
//                     }
//                 });
//                 console.log('Password saved');
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, message: 'Error storing password.' });
//     }
// };


// exports.login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Fetch user by email from Firebase Firestore
//         const users = await admin.firestore().collection('users').where('email', '==', email).get();
//         if (users.empty) {
//             return res.status(400).json({ message: 'Email and/or Password is Invalid' });
//         }

//         const user = users.docs[0].data();

//         // Check password using bcrypt
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Email and/or Password is Invalid' });
//         }

//         // If everything's okay, send a positive response
//         res.status(200).json({ message: 'Logged in successfully', user: user }); // Adjust the response as needed.

//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }

exports.storePassword = async (req, res) => {
    console.log('request made');
    const { password, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Define the column name based on userType

        // Check if the user exists in the MySQL database
        const selectUserQuery = `SELECT * FROM users WHERE email = ?`;
        const userResults = await connection.query(selectUserQuery, [email], async (error, results) => {
            if (error) {
                console.log(error);
                console.log(`${userType} not found`);
                res.status(404).json({ success: false, message: `${userType} not found.` });
            } else {
                // User already exists, update the password
                const updatePasswordQuery = `UPDATE users SET password = ? WHERE email = ?`;
                await connection.query(updatePasswordQuery, [hashedPassword, email]);

                // Fetch updated user data
                const selectUpdatedUserQuery = `SELECT * FROM users WHERE email = ?`;
                await connection.query(selectUpdatedUserQuery, [email], (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        const userData = results[0];
                        res.status(200).json({ success: true, user: userData });
                    }
                });
                console.log('Password saved');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error storing password.' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user by email from MySQL database
        const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
        const userResults = await connection.query(selectUserQuery, [email], async (error, results) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ message: 'Email and/or Password is Invalid' });

            } else {
                if (results.length === 0) {
                    return res.status(400).json({ message: 'Email and/or Password is Invalid' });

                }
                const user = results[0];

                // Check password using bcrypt
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Email and/or Password is Invalid' });
                }

                // If everything's okay, send a positive response
                res.status(200).json({ message: 'Logged in successfully', user: user }); // Adjust the response as needed.
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// exports.resetEmail = async (req, res) => {
//     const { email } = req.body;

//     const userSnapshot = await getUserByEmail(req.body.email);

//     // if (!userSnapshot.exists) return res.status(404).send('No user with that email');
//     if (userSnapshot.empty) return res.status(404).send('No user with that email');

//     // const user = userSnapshot.data();

//     // Generate a token
//     const token = crypto.randomBytes(20).toString('hex');
//     const updates = {
//         passwordResetToken: token,
//         passwordResetExpires: Date.now() + 3600000 // 1 hour
//     };

//     await updateUserByEmail(req.body.email, updates);

//     // Send the email (using nodemailer for example)
//     mailtransporter = nodemailer.createTransport({
//         service: 'gmail', // use your email service here
//         auth: {
//             user: `mail.pacholdings@gmail.com`,
//             pass: `zwveytcpxozeopyx`  // replace with your email password
//         }
//     });

//     const mailOptions = {
//         to: email,
//         from: 'passwordreset@example.com',
//         subject: 'Password Reset',
//         text: 'Click this link to reset your password: ' + process.env.RESET_PASSWORD_BASE_URL + token
//     };
//     mailtransporter.sendMail(mailOptions, (err) => {
//         res.send('Reset password link sent');
//     });
// }
exports.resetEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists in the MySQL database
        const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
        await connection.query(selectUserQuery, [email], async (error, results) => {
            if (error) {
                console.log(error)
            } else {
                if (results.length === 0) {
                    console.log('no user with that email');
                    return res.status(404).send('No user with that email');
                }

                // Generate a token
                const token = crypto.randomBytes(20).toString('hex');
                const updates = {
                    passwordResetToken: token,
                    passwordResetExpires: new Date(Date.now() + 3600000),
                };

                // Update the user with the token and expiration time
                const updateQuery = 'UPDATE users SET ? WHERE email = ?';
                await connection.query(updateQuery, [updates, email]);

                // Send the email using nodemailer
                const mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'mail.pacholdings@gmail.com',
                        pass: 'zwveytcpxozeopyx', // replace with your email password
                    },
                });

                const mailOptions = {
                    to: email,
                    from: 'passwordreset@example.com',
                    subject: 'Password Reset',
                    text: 'Click this link to reset your password: ' + process.env.RESET_PASSWORD_BASE_URL + token,
                };

                mailTransporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        console.error('Error sending reset password email:', err);
                        res.status(500).send('Error sending reset password email');
                    } else {
                        res.send('Reset password link sent');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password');
    }
};

// exports.resetPassword = async (req, res) => {
//     const usersRef = db.collection('users');
//     const snapshot = await usersRef.where('passwordResetToken', '==', req.params.token).get();

//     if (snapshot.empty) return res.status(400).send('Token invalid');

//     const user = snapshot.docs[0];
//     if (user.data().passwordResetExpires <= Date.now()) {
//         return res.status(400).send('Token expired');
//     }

//     // console.log('email', user.data().email);
//     const email = user.data().email

//     const password = req.body.newPassword

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const updates = {
//         password: hashedPassword, // Make sure to hash the password!
//         passwordResetToken: admin.firestore.FieldValue.delete(),
//         passwordResetExpires: admin.firestore.FieldValue.delete()
//     };

//     await updateUserByEmail(email, updates);

//     res.send('Password reset successful');
// }
exports.resetPassword = async (req, res) => {
    try {
        // Check if the user with the given token exists in the MySQL database
        const selectUserQuery = 'SELECT * FROM users WHERE passwordResetToken = ?';
        await connection.query(selectUserQuery, [req.params.token], async (error, results) => {
            if (error) {
                console.log(error);
            } else {
                if (results.length === 0) {
                    return res.status(400).send('Token invalid');
                }

                const user = results[0];

                if (new Date(user.passwordResetExpires) <= new Date()) {
                    console.log('token expired');
                    return res.status(400).send('Token expired');
                }

                const email = user.email;
                const password = req.body.newPassword;

                // Hash the new password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Update the user's password and remove reset token and expiration
                const updateQuery = 'UPDATE users SET password = ?, passwordResetToken = NULL, passwordResetExpires = NULL WHERE email = ?';
                await connection.query(updateQuery, [hashedPassword, email]);

                res.send('Password reset successful');
            }
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send('Error resetting password');
    }
};


// exports.logoutDriver = async (req, res) => {
//     try {
//         // Get the user ID using the email address
//         const { email, ride } = req.body;
//         const { rideId, patient } = ride

//         const usersRef = admin.firestore().collection('users');
//         const userSnapshot = await usersRef.where('email', '==', email).get();

//         if (userSnapshot.empty) {
//             return res.status(400).json({ message: 'User not found with the provided email address' });
//         }

//         const userId = userSnapshot.docs[0].id;

//         // Get the user data for additional operations
//         const userData = userSnapshot.docs[0].data();

//         // Update the user's status and remove sosRideId
//         await admin.firestore().collection('users').doc(userId).update({
//             sos: false,
//             patientCoordinates: null
//         });

//         // Additional feature: Check and cancel the ride
//         if (rideId) {
//             const ridesRef = admin.firestore().collection('rides');
//             // const rideSnapshot = await ridesRef.doc(userData.sosRideId).get();
//             const rideSnapshot = await ridesRef.where('rideId', '==', rideId).get();

//             if (!rideSnapshot.empty) {
//                 console.log('ride exists');
//                 const rideData = rideSnapshot.docs[0].data();

//                 // Set the ride status to 'cancelled'
//                 await ridesRef.doc(rideSnapshot.docs[0].id).update({ status: 'cancelled' });

//                 // Additional feature: Check and update driver status
//                 if (patient) {
//                     // const driverSnapshot = await usersRef.doc(rideData.assignedDriver).get();
//                     const motherSnapshot = await usersRef.where('email', '==', patient.email).get();

//                     if (!motherSnapshot.empty) {
//                         console.log('there is mother');
//                         // Update the driver's sos status to false
//                         await usersRef.doc(motherSnapshot.docs[0].id).update({ sos: false, sosRideId: null });
//                     }
//                 }
//             } else {
//                 console.log('ride not found');
//             }
//         }

//         // Send a positive response
//         res.status(200).json({ message: 'Logged out successfully' });

//     } catch (error) {
//         console.error('Logout error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }

exports.logoutDriver = async (req, res) => {
    try {
        const { email, ride } = req.body;
        const { rideId, patient } = ride;

        // Get the user ID using the email address
        const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
        const [userResults] = await connection.query(selectUserQuery, [email]);

        if (userResults.length === 0) {
            return res.status(400).json({ message: 'User not found with the provided email address' });
        }

        const userId = userResults[0].id;

        // Update the user's status and remove sosRideId
        const updateUserQuery = 'UPDATE users SET sos = false, patientCoordinates = null WHERE id = ?';
        await connection.query(updateUserQuery, [userId]);

        // Additional feature: Check and cancel the ride
        if (rideId) {
            const selectRideQuery = 'SELECT * FROM rides WHERE rideId = ?';
            const [rideResults] = await connection.query(selectRideQuery, [rideId]);

            if (rideResults.length > 0) {
                console.log('ride exists');
                const rideData = rideResults[0];

                // Set the ride status to 'cancelled'
                const updateRideQuery = 'UPDATE rides SET status = ? WHERE id = ?';
                await connection.query(updateRideQuery, ['cancelled', rideData.id]);

                // Additional feature: Check and update driver status
                if (patient) {
                    const selectMotherQuery = 'SELECT * FROM users WHERE email = ?';
                    const [motherResults] = await connection.query(selectMotherQuery, [patient.email]);

                    if (motherResults.length > 0) {
                        console.log('there is mother');
                        // Update the driver's sos status to false
                        const updateMotherQuery = 'UPDATE users SET sos = false, sosRideId = null WHERE id = ?';
                        await connection.query(updateMotherQuery, [motherResults[0].id]);
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
};

// exports.logout = async (req, res) => {
//     try {
//         // Get the user ID using the email address
//         const { email } = req.body;
//         const usersRef = admin.firestore().collection('users');
//         const userSnapshot = await usersRef.where('email', '==', email).get();

//         if (userSnapshot.empty) {
//             return res.status(400).json({ message: 'User not found with the provided email address' });
//         }

//         const userId = userSnapshot.docs[0].id;

//         // Get the user data for additional operations
//         const userData = userSnapshot.docs[0].data();

//         // Update the user's status and remove sosRideId
//         await admin.firestore().collection('users').doc(userId).update({
//             sos: false,
//             sosRideId: null,
//         });

//         // Additional feature: Check and cancel the ride
//         if (userData.sosRideId) {
//             const ridesRef = admin.firestore().collection('rides');
//             // const rideSnapshot = await ridesRef.doc(userData.sosRideId).get();
//             const rideSnapshot = await ridesRef.where('rideId', '==', userData.sosRideId).get();

//             if (!rideSnapshot.empty) {
//                 console.log('ride exists');
//                 const rideData = rideSnapshot.docs[0].data();

//                 // Set the ride status to 'cancelled'
//                 await ridesRef.doc(rideSnapshot.docs[0].id).update({ status: 'cancelled' });

//                 // Additional feature: Check and update driver status
//                 if (rideData.assignedDriver) {
//                     // const driverSnapshot = await usersRef.doc(rideData.assignedDriver).get();
//                     const driverSnapshot = await usersRef.where('email', '==', rideData.assignedDriver.email).get();

//                     if (!driverSnapshot.empty) {
//                         console.log('there is assigned driver');
//                         // Update the driver's sos status to false
//                         await usersRef.doc(driverSnapshot.docs[0].id).update({ sos: false });
//                     }
//                 }
//             } else {
//                 console.log('ride not found');
//             }
//         }

//         // Send a positive response
//         res.status(200).json({ message: 'Logged out successfully' });

//     } catch (error) {
//         console.error('Logout error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }

exports.logout = async (req, res) => {
    try {
        // Get data from request body
        const { email } = req.body;

        // Use transaction for data consistency
        await withTransaction(async () => {
            // 1. Get user ID by email
            await executeQuery('SELECT id FROM users WHERE email = ?', [email], async (error, userRow) => {
                if (error) {
                    console.log(error);
                    return res.status(400).json({ message: error.message });

                }

                if (!userRow) {
                    return res.status(400).json({ message: 'User not found with the provided email address' });
                }
                const userId = userRow[0].id;

                // 2. Update user's sos status and remove ride ID
                await executeQuery('UPDATE users SET sos = 0, sosRideId = NULL WHERE id = ?', [userId]);

                // 3. Check and cancel ride (if exists)
                await executeQuery('SELECT id, assignedDriver FROM rides WHERE rideId = ?', [userData.sosRideId], async (error, rideRow) => {
                    if (error) {
                        console.log(error);
                        return res.status(400).json({ message: error.message });
                    }

                    if (rideRow) {
                        console.log('ride exists');

                        // Update ride status to cancelled
                        await executeQuery('UPDATE rides SET status = "cancelled" WHERE id = ?', [rideRow[0].id]);

                        // Check and update driver's sos status
                        if (rideRow[0].assignedDriver) {
                            const [driverRow] = await executeQuery('SELECT id FROM users WHERE email = ?', [rideData.assignedDriver.email]);
                            if (driverRow) {
                                console.log('there is assigned driver');
                                await executeQuery('UPDATE users SET sos = 0 WHERE id = ?', [driverRow[0].id]);
                            }
                        }
                    } else {
                        console.log('ride not found');
                    }
                });

            });

        });

        // Send successful response
        res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const email = req.params.email;
        const imagePath = req.file.path;

        // Save image path to the 'image' column in the 'users' table
        // const updateQuery = 'UPDATE users SET image = ? WHERE email = ?';
        // await connection.query(updateQuery, [imagePath, email]);

        const imgUrl = `localhost:8080/${imagePath}`

        res.status(200).json({ message: 'Image uploaded and associated with user successfully', imgUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}