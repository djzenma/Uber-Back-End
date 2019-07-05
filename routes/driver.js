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
            mysql.query(`UPDATE  ride SET state = "running", driveremail ="${email}" WHERE rideid=${result[0].rideid};`, (err, rideResult) => {
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
                        else if(fareRes.length !== 0) {
                            mysql.query(`SELECT value FROM discountcode WHERE dcode = "${result[0].dcode}"`, (e, r) => {
                                if (e)
                                    console.log(e);
                                else if (r.length !== 0 )
                                   {  const resBody =
                                       {
                                           name: updateResult[0].name,
                                           endLoc: result[0].fare_e,
                                           fare: fareRes[0].price - r[0].value,
                                           rideid : result[0].rideid
                                       };
                                       res.status(200).json(resBody);
                                   }
                            });

                        }
                    });
                }
            });
        }
        else
            res.status(404).end("Ride Not Found!");
    });
});



/*
*   Driver req that he ended the ride
*/
router.post('/ended', function(req, res, next) {
    const driverEmail = req.body.driverEmail;

    // Update the ride state to ENDED
    mysql.query(`SELECT * FROM ride WHERE state="running" AND driveremail='${driverEmail}';`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(404).end("Ride Not Found!");
        }
        else if (result.length !== 0) {
            mysql.query(`UPDATE  ride SET state = "ended" WHERE rideid=${result[0].rideid};`, (err, updateResult) => {
                if (err)
                    console.log(err);
                else
                    res.status(200).end("Ride Ended Successfully");
            });
            mysql.query(`SELECT * FROM fare WHERE fstart = '${result[0].fare_s}' AND fend ='${result[0].fare_e}';`, (e, fareRes) => {
                if (e)
                    console.log (e);
                else
                {
                    mysql.query(`SELECT value FROM discountcode WHERE dcode = "${result[0].dcode}"`, (derr, r) => {
                        if(derr)
                            console.log(derr);
                        else if(r.length !== 0) {
                            mysql.query(`UPDATE  rider SET balance = balance - ${fareRes[0].price - r[0].value} WHERE email="${result[0].rideremail}";`, (er, deducedRes) => {
                                if (er)
                                    console.log(er);
                                else
                                    res.status(200).end("Rider Balance Updated Successfully ");

                            });

                            mysql.query(`UPDATE  driver SET credit = credit + ${fareRes[0].price - r[0].value} WHERE email="${result[0].driveremail}";`, (errr, addedRes) => {
                                if (errr)
                                    console.log(errr);
                                else
                                    res.status(200).end("Driver Balance Updated Successfully ");

                            });
                        }
                    });
                }
            });
            }
        else
            res.status(404).end("No Rides To End!");
    });
});

router.post('/arrived', function(req, res, next)
{
    const email = req.body.driveremail;
    const id = req.body.rideid;

    mysql.query(`SELECT state FROM ride WHERE  rideid='${id}';`, (error, result) => {
        if (error) {
            console.log(error);
        }
        else
        {
            console.log ()
            if (result.length !== 0 )
            {
                if (result[0].state === "running")
                    res.status(200).end("Ride Still Running");
                else
                    if (result[0].state === "cancelled")
                        res.status(404).end("Ride Cancelled");

            }
        }
    });
 });


/*
    Admin requests to add a new driver
 */
router.post('/add/', (req,res,next) => {
    const email = req.body.email;
    const pass = req.body.password;

    mysql.query(`INSERT INTO driver(email, passcode) VALUES('${email}','${pass}');`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Driver added Successfully!");
        }
    });
});


/*
    Admin requests to remove a driver
 */
router.delete('/remove/', (req,res,next) => {
    const email = req.body.email;

    mysql.query(`DELETE FROM driver WHERE email='${email}';`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Driver deleted Successfully");
        }
    });
});



/*
    Driver requests to update his password
 */
router.put('/modify/', (req,res,next) => {
    const email = req.body.email;
    const newPass = req.body.password;

    mysql.query(`UPDATE driver SET passcode='${newPass}' WHERE email='${email}';`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Driver's password Updated Successfully");
        }
    });
});



module.exports = router;