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
        else if(result.length !== 0){ //if found running ride
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
        else {
            mysql.query( `SELECT driverEmail FROM ride WHERE riderEmail="${email}" AND state="ended"`, (ee, rr) => {
                if (ee)
                    console.log (ee);
                else
                    if (rr.length !== 0  )
                        res.status(404).json({noRide: false}); //found ended ride
                    else
                        res.status(404).json({noRide: true}); //if did not find ride
            });
        }
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



/*
    Rider requests to update his password
 */
router.put('/modify/', (req,res,next) => {
    const email = req.body.email;
    const newPass = req.body.password;
    const birth = req.body.birth;
    const name = req.body.name;

    mysql.query(`UPDATE rider SET passcode='${newPass}', name='${name}', bdate='${birth}' WHERE email='${email}';`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Rider's password Updated Successfully");
        }
    });
});

module.exports = router;