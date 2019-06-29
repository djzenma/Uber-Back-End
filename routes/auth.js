var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
*   AUTH
*/
router.get('/', function(req, res, next) {
  const email = req.body.email;
  const pass = req.body.password;
  const role = req.body.role;
  mysql.query(`SELECT * FROM ${role} WHERE email=${email}`, (error, result) => {
    if (error)
      console.log(error);
    else {
      console.log(result);
      if(result.password === pass)
        res.status(200).json(result);
      else
        res.status(401).end("Unauthorized!");
    }
  });
});

module.exports = router;