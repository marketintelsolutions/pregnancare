const db = require("../auth/firebase");

exports.saveUserDetails = (user) => {
    const usersCollection = db.collection('users');
    return usersCollection.add(user);
}

exports.generateCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
}


