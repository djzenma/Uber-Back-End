const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'Toktok-Db',
});

connection.connect((error) => {
    if(error)
        throw error;
    console.log('sql working...');
});


module.exports = connection;