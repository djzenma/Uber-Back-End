var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
*   Driver req when he is available
*/
router.post('/', function(req, res, next) {
    const email = req.body.driverEmail;
    const loc = req.body.loc;
    //console.log (loc);
    // Get the ride
    mysql.query(`SELECT * FROM ride WHERE fare_s='${loc}' AND state="pending";`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(404).end("Ride Not Found!");
        }
        else if (result.length !== 0) {
            mysql.query(`UPDATE  ride SET state = "running", driveremail ="${email}" WHERE rideid=${result[0].rideid};`, (err, updateResult) => {
                if (err)
                    console.log(err);
            });

            mysql.query(`SELECT * FROM rider WHERE email IN (SELECT rideremail FROM ride WHERE driveremail='${email}' AND state="running")`, (error, updateResult) => {
                if (error) {
                    console.log(error);
                    res.status(404).end("Rider Not Found!");
                }
                else {
                    mysql.query(`SELECT * FROM fare WHERE fstart = '${loc}' AND fend ='${result[0].fare_e}';`, (e, fareRes) => {
                        if (e) {
                            console.log(e);
                            res.status(404).end("Fare Not Found!");
                        }
                        else {
                            const resBody =
                                {
                                    name: updateResult[0].name,
                                    endLoc: result[0].fare_e,
                                    fare: fareRes[0].price
                                };
                            res.status(200).json(resBody);
                        }
                    });
                }
            });
        }
        else
            res.status(404).end("Ride Not Found!");
    });
});


module.exports = router;