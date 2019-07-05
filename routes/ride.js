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
    const date = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDay();
    const rideId = Math.trunc((parseInt(Date.now() + '' + Math.random()))/ 10000);
    const promo = req.body.promocode ;

    // Insert the ride
    mysql.query( `INSERT INTO ride(rideid, state, ridedate, driveremail, fare_s, fare_e, rideremail, dcode) VALUES(${rideId}, "pending", "${date}", NULL, "${sLoc}", "${eLoc}", "${riderProfile.email}" , "${promo}");`, (error, ress) => {
        if (error) {
            console.log(error);
            res.status(404).end();  // TODO:: Change status code
        }
        else if(ress.length !== 0) {
            // Search for the fare amount
            mysql.query(`SELECT price FROM Fare WHERE fstart='${sLoc}' AND fend='${eLoc}'`, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(404).end();  // TODO:: Change status code
                } else {
                    mysql.query(`SELECT value FROM discountcode WHERE dcode = "${promo}"`, (e, r) => {
                        if (e)
                            console.log(e);
                        else
                            if (r.length !== 0 )
                        res.status(200).json({fare: result[0].price - r[0].value });
                    });
                }
            });
        }
        else
            res.status(404).end();  // TODO:: Change status code
    });
});


router.post('/nodriver', function(req, res, next) {

    const sLoc = req.body.startLoc;
    const eLoc = req.body.endLoc;
    const riderProfile = req.body.profile;

    mysql.query( `DELETE FROM ride WHERE state ="pending" AND fare_s= "${sLoc}" AND fare_e = "${eLoc}" AND rideremail ="${riderProfile.email}";`, (ee, rr) => {
    if (ee)
        console.log (ee);
    else
        res.status(200).end("Ride Removed Successfully");
    });
});

module.exports = router;