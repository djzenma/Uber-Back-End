const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Toktok-Db',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

connection.connect((error) => {
    if(error)
        throw error;
    console.log('sql working...');
});


module.exports = connection;