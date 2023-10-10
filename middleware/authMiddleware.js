const db = require("../auth/firebase");
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

exports.saveUserDetails = (user) => {
    const usersCollection = db.collection('users');
    return usersCollection.add(user);
}

exports.generateCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

exports.getUserByEmail = async (email) => {
    const users = await admin.firestore().collection('users').where('email', '==', email).get();
    console.log(users.empty);
    return users
}

exports.updateUserByEmail = async (email, data) => {
    // return db.collection('users').doc(email).update(data);
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.where('email', '==', email).get();
    // console.log('email:', email);
    // const users = await admin.firestore().collection('users').where('email', '==', email).get();

    // console.log(users.empty);
    try {
        if (!userSnapshot.empty) {
            console.log('user exists');
            // User already exists, update the password
            const userId = userSnapshot.docs[0].id;
            await usersRef.doc(userId).update(data);
            return
        }
        console.log('user doesnt exist');
    } catch (error) {
        console.log(error);
    }

}

exports.createUser = (email, data) => {
    return db.collection('users').doc(email).set(data);
}




