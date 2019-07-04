var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');


/*
    Admin requests to add a new promo code
 */
router.post('/add/', (req,res,next) => {
    const code = req.body.code;
    const amount = req.body.amount;

    mysql.query(`INSERT INTO discountcode(dcode, value) VALUES('${code}',${amount});`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end();
        }
    });
});

/*
    Admin requests to remove a promo code
 */
router.delete('/remove/', (req,res,next) => {
    const code = req.body.code;

    mysql.query(`DELETE FROM discountcode WHERE dcode='${code}';`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Promo Code deleted Successfully");
        }
    });
});

/*
    Admin requests to update the value of a promo code
 */
router.put('/modify/', (req,res,next) => {
    const code = req.body.code;
    const newAmount = req.body.amount;

    mysql.query(`UPDATE discountcode SET value=${newAmount} WHERE dcode='${code}';`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Promo Code Updated Successfully");
        }
    });
});


module.exports = router;