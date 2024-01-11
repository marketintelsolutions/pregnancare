// // mysqlConnection.js
// const mysql = require('mysql');

// const connection = mysql.createConnection({
//     connectionLimit: 100,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     port: 3306
// });


// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//     } else {
//         console.log('Connected to database');
//     }
// });

// module.exports = connection;

// db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to database');
    }
});

const withTransaction = async (callback) => {
    try {
        // Begin transaction
        await executeQuery('START TRANSACTION');

        // Execute the callback function (which contains the SQL queries)
        await callback();

        // Commit the transaction
        await executeQuery('COMMIT');
    } catch (error) {
        // Rollback the transaction in case of an error
        await executeQuery('ROLLBACK');
        console.error('Transaction error:', error);
        throw error; // Re-throw the error to be handled by the calling function
    }
};

const executeQuery = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
};

module.exports = {
    connection,
    withTransaction,
    executeQuery,
};

