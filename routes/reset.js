var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');
const nodemailer = require("nodemailer");



router.get('/account?', (req,res,next) => {
    const accountEmail = req.query.email;
    const role = req.query.role;

    mysql.query( `SELECT * FROM ${role} WHERE email='${accountEmail}';`, (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).end("The query is wrong!");
        }
        else if(result.length !== 0){
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'mazjass@gmail.com', // generated ethereal user
                    pass: 'stackOverflow011' // generated ethereal password
                }
            });

            // send mail with defined transport object
            transporter.sendMail({
                from: '"Fred Foo 👻" <mazjass@gmail.com>', // sender address
                to: result[0].email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>" // html body
            }, (er, info) => {
                if(er) {
                    console.log(er);
                    res.status(500).end();
                }
                else
                res.status(200).end();
            });

        }
    });
});


module.exports = router;