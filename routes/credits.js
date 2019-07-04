var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
    Admin requests to update a driver/rider credit
 */
router.put('/modify/', (req,res,next) => {
    const email = req.body.email;
    const newAmount = req.body.amount;

    // Search if it is a driver, if so update his credit
    mysql.query(`SELECT * FROM driver WHERE email='${email}'`, (error, result) => {
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else if(result.length !== 0) {
            mysql.query(`UPDATE driver SET credit=credit+${newAmount} WHERE email='${email}';`, (err, updateResult)=>{
                if(err) {
                    console.log(err);
                    res.status(500).end();
                }
                else {
                    res.status(200).end("Driver's balance Updated Successfully");
                }
            });
        }
    });


    // Search if it is a rider, if so update his credit
    mysql.query(`SELECT * FROM rider WHERE email='${email}'`, (error, result) => {
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else if(result.length !== 0) {
            mysql.query(`UPDATE rider SET balance=balance+${newAmount} WHERE email='${email}';`, (err, updateResult)=>{
                if(err) {
                    console.log(err);
                    res.status(500).end();
                }
                else {
                    res.status(200).end("Promo Code Updated Successfully");
                }
            });
        }
    });
});



module.exports = router;