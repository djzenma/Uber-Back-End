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
    mysql.query( `SELECT driverEmail FROM ride WHERE riderEmail="${email}" AND state="running"`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(404).end();  // TODO:: Change status code
        }
        else if(result.length !== 0){
            if(result[0].driverEmail !== null) {
                mysql.query(`SELECT name FROM Driver WHERE email='${result[0].driverEmail}'`, (err, nameResult) => {
                    if (err)
                        console.log (err);
                    else
                    if (nameResult.length !== 0  )
                        res.status(200).json(nameResult[0].name);

                });
            }
        }
        else
            res.status(404).json({noRide: true});
    });
});


/*
*
*   Receive riderEmail, sLoc and eLoc
*   Send cancellation fee
*/
router.get('/cancel/plz', function(req, res, next) {
    const email = req.query.email;
    const sLoc = req.query.sLoc;
    const eLoc = req.query.eLoc;

    console.log(email + sLoc + eLoc);

    mysql.query(`SELECT * FROM ride WHERE state="running" AND rideremail='${email}';`, (error, rideRes) => {
        if (error) {
            console.log(error);
            res.status(500).end("Error!");
        }
        else if(rideRes.length !== 0){
            mysql.query( `UPDATE ride SET state = "cancelled" WHERE rideremail="${email}" AND state ="running"`, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).end("Error!");
                }
                else if(result.length !== 0){
                    mysql.query( `SELECT * FROM fare WHERE fstart="${sLoc}" AND fend="${eLoc}"`, (e, cancelRes) => {
                        if(e) {
                            console.log(e);
                            res.status(500).end("Error!");
                        }
                        else if(cancelRes.length !== 0) {
                            res.status(200).json({cancelFee: cancelRes[0].cancellationfee});

                            mysql.query(`UPDATE  rider SET balance = balance - ${cancelRes[0].cancellationfee} WHERE email="${rideRes[0].rideremail}";`, (er, deducedRes) => {
                                if (er)
                                    console.log(er);
                                else
                                    res.status(200).end("Rider Balance Updated Successfully ");

                            });

                            mysql.query(`UPDATE  driver SET credit = credit + ${cancelRes[0].cancellationfee} WHERE email="${rideRes[0].driveremail}";`, (errr, addedRes) => {
                                if (errr)
                                    console.log(errr);
                                else
                                    res.status(200).end("Driver Balance Updated Successfully ");

                            });
                        }
                    });
                }
                else
                    res.status(404).end("No rides to cancel");
            });
        }
    });
});

module.exports = router;