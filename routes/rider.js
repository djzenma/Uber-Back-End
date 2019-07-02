var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
*   RIDER
*   Receive riderEmail
*   Send driverName and fare
*/
router.get('/:riderEmail', function(req, res, next) {
    const email = req.params.riderEmail;
    // Get the driver name
    mysql.query( `SELECT driverEmail FROM ride WHERE riderEmail="${email}" AND state="pending"`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(404).end();
        }
        else if(result.length !== 0){
            if(result[0].driverEmail !== null) {
                mysql.query(`SELECT name FROM Driver WHERE email=${result[0].email}`, (err, nameResult) => {
                    res.status(200).json(nameResult[0].name);
                });
            }
        }
        else
            res.status(404).json({noRides: true});
    });
});

module.exports = router;