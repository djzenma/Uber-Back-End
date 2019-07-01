var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
*   RIDE
*   Rider req
*   Receive startLoc, endLoc, profile
*   Send driverName and fare
*/
router.post('/', function(req, res, next) {
    const sLoc = req.body.startLoc;
    const eLoc = req.body.endLoc;
    const riderProfile = req.body.profile;
    const date = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDay() + ' ' + new Date().getHours() + '-'  + new Date().getMinutes(); // TODO:: modify
    const rideId = Math.trunc((parseInt(Date.now() + '' + Math.random()))/ 10000);

    // Insert the ride
    mysql.query( `INSERT INTO ride(rideid, state, ridedate, driveremail, fare_s, fare_e, rideremail) VALUES(${rideId}, "pending", "${date}", "NULL", "${sLoc}", "${eLoc}", "${riderProfile.email}");`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(404).end();  // TODO:: Change status code
        }
        else if(result.length !== 0) {
            // Search for the fare amount
            mysql.query(`SELECT price FROM Fare WHERE fstart=${sLoc} AND fend=${eLoc}`, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(404).end();  // TODO:: Change status code
                } else {
                    res.status(200).end({fare: result[0]});
                }
            });
        }
        else
            res.status(404).end();  // TODO:: Change status code
    });
});



module.exports = router;