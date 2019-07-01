var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
*   Driver req when he is available
*/
router.post('/', function(req, res, next) {
    const email = req.body.driverEmail;
    const loc = req.body.loc;

    // Get the ride
    mysql.query(`SELECT * FROM ride WHERE fare_s=${loc} AND state="pending";`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(404).end();  // TODO:: Change status code
        }
        else if(result.length !== 0){
            mysql.query(`UPDATE INTO ride(state, driveremail) VALUES("running", ${email}) WHERE rideid=${result[0].rideId};`, (err, updateResult=>{
                if(err)
                    console.log(err);
            }));

            mysql.query(`SELECT * FROM rider WHERE email IN (SELECT rideremail FROM ride WHERE driveremail=${email})`, (err, updateResult=>{
                if(err)
                    console.log(err);
                else {
                    const resBody = {
                        name: updateResult[0].name,
                        endLoc: result[0].fareE
                    };
                    res.status(200).json(resBody);
                }
            }));
        }
        else {
            res.status(404).end("Not Found!");  // TODO:: Change status code
        }
    });
});


module.exports = router;