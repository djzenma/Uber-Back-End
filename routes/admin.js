var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
    Admin requests to add a new admin
 */
router.post('/add/', (req,res,next) => {
    const email = req.body.email;
    const pass = req.body.password;
    const adder = req.body.adder;

    mysql.query(`INSERT INTO admin(email, passcode, adderemail) VALUES('${email}','${pass}', '${adder}');`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Admin added Successfully!");
        }
    });
});


/*
    Admin requests to remove an admin
 */
router.delete('/remove/', (req,res,next) => {
    const email = req.body.email;
    const changer = req.body.changer;

    mysql.query('SET FOREIGN_KEY_CHECKS=0;', (err, resu)=>{
        if(err)
            console.log(err);
        else {
            mysql.query(`DELETE FROM admin WHERE email='${email}';`, (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).end();
                } else {
                    res.status(200).end("Admin deleted Successfully");

                    // Keep a record
                    mysql.query(`INSERT INTO chnged(changeremail, changedemail, pass_delete) VALUES('${changer}','${email}', 1);`, (e, r) => {
                        if (e)
                            console.log(e);
                        else{
                            mysql.query('SET FOREIGN_KEY_CHECKS=1;',()=>{});
                        }
                    });
                }
            });
        }
    });

});


/*
    Admin requests to update the password of an admin
 */
router.put('/modify/', (req,res,next) => {
    const email = req.body.email;
    const newAmount = req.body.password;
    const changer = req.body.changeremail;

    mysql.query(`UPDATE admin SET passcode='${newAmount}' WHERE email='${email}';`, (error, result)=>{
        if(error) {
            console.log(error);
            res.status(500).end();
        }
        else {
            res.status(200).end("Admin's password Updated Successfully");
            // Keep a record
            mysql.query(`INSERT INTO chnged(changeremail, changedemail, pass_delete) VALUES('${changer}','${email}', 0);`, (e, r)=>{
                if(e)
                    console.log(e);
            });
        }
    });
});


module.exports = router;
