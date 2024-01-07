// userQueries.js
const connection = require('../database/db');

// const saveUser = async (userData, res) => {
//     console.log(userData);
//     return new Promise((resolve, reject) => {
//         const query = 'INSERT INTO users (email, firstname, age, children, pet, csection, bloodGroup, genotype,userType,imgUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//         const values = [
//             userData.email,
//             userData.firstname,
//             userData.age,
//             userData.children,
//             userData.pet,
//             userData.csection,
//             userData.bloodGroup,
//             userData.genotype,
//             userData.userType,
//             userData.imgUrl
//         ];

//         connection.query(query, values, (err, results) => {
//             if (err) {
//                 console.log('Email already in use');
//                 console.log(err.sqlMessage);
//                 return res.status(400).json('Email already in use');
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };
const saveUser = async (userData, res) => {
    // console.log(userData);
    const newData = { ...userData, image: userData.imgUrl }
    return new Promise((resolve, reject) => {
        const keys = Object.keys(newData);
        const placeholders = Array.from({ length: keys.length }, () => '?').join(', ');

        let columnName = 'users'

        const query = `INSERT INTO ${columnName} (${keys.join(', ')}) VALUES (${placeholders})`;
        const values = keys.map(key => newData[key]);

        connection.query(query, values, (err, results) => {
            if (err) {
                // console.log('Email already in use');
                console.log(err);
                return res.status(400).json('Email already in use');
            } else {
                console.log('saved user');
                resolve(results);
            }
        });
    });
};

module.exports = {
    saveUser,
};
