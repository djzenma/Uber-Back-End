var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');


/*
    Admin requests to add a new promo code
 */
router.post('/add/', (req,res,next) => {
    const code = req.body.code;
    const amount = req.body.amount;
    const admin = req.body.admin;

    mysql.query(`INSERT INTO discountcode(dcode, value) VALUES('${code}',${amount});`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end();

            // Keep record
            mysql.query(`INSERT INTO modifydiscountcode(changeremail, disccode, ins_upd_del) VALUES('${admin}','${code}', 0);`, (e, r) => {
                if (e)
                    console.log(e);
            });
        }
    });
});

/*
    Admin requests to remove a promo code
 */
router.delete('/remove/', (req,res,next) => {
    const code = req.body.code;
    const admin = req.body.admin;

    mysql.query('SET FOREIGN_KEY_CHECKS=0;',(er, re)=> {
        if (er)
            console.log(er);
        else {
            mysql.query(`DELETE FROM discountcode WHERE dcode='${code}';`, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).end();
                } else {
                    res.status(200).end("Promo Code deleted Successfully");

                    // Keep record
                    mysql.query(`INSERT INTO modifydiscountcode(changeremail, disccode, ins_upd_del) VALUES('${admin}','${code}', 2);`, (e, r) => {
                        if (e)
                            console.log(e);
                        else {
                            mysql.query('SET FOREIGN_KEY_CHECKS=1;',(e, r)=> {});
                        }
                    });
                }
            });
        }
    });
});

/*
    Admin requests to update the value of a promo code
 */
router.put('/modify/', (req,res,next) => {
    const code = req.body.code;
    const newAmount = req.body.amount;
    const admin = req.body.admin;

    mysql.query(`UPDATE discountcode SET value=${newAmount} WHERE dcode='${code}';`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Promo Code Updated Successfully");

            // Keep record
            mysql.query(`INSERT INTO modifydiscountcode(changeremail, disccode, ins_upd_del) VALUES('${admin}','${code}', 1);`, (e, r) => {
                if (e)
                    console.log(e);
            });
        }
    });
});


module.exports = router;