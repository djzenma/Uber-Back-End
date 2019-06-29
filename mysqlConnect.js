const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'toktok'
});

connection.connect((error) => {
    if(error)
        throw error;
});


module.exports = connection;