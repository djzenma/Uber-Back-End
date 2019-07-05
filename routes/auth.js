var express = require('express');
var router = express.Router();
const mysql = require('./../mysqlConnect');

/*
*   AUTH Login
*/
router.post('/', function(req, res, next) {
  const email = req.body.email;
  const pass = req.body.password;
  const role = req.body.role;

  mysql.query( `SELECT * FROM ${role} WHERE email='${email}';`, (error, result) => {
    if (error) {
      console.log(error);
      res.status(404).end("The query is wrong!");
    }
    else if(result.length !== 0){
      if(result[0].passcode === pass)
        res.status(200).json(result[0]);
      else
        res.status(401).end("Wrong Password!");
    }
    else
      res.status(401).end("You have to sign up first!");
  });
});


/*
*   AUTH Sign Up
*/
router.post('/signup', function(req, res, next) {
  const email = req.body.email;
  const pass = req.body.password;
  const role = req.body.role;
  const bdate = req.body.bdate;
  const name = req.body.name;

  mysql.query( `INSERT INTO ${role}(email, bdate, passcode, name) VALUES("${email}", '${bdate}', "${pass}", "${name}");`, (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).end("Something wrong happened! Make sure your credentials are correct!");
    }
    else {
      res.status(200).end();
    }
  });
});

////Add Fav Place
router.post('/favAdd', function(req, res, next) {
  const email = req.body.email;
  const fav = req.body.fav;


  mysql.query( `INSERT INTO favplaces (rideremail, place) VALUES("${email}", '${fav}');`, (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).end("Couldn't Add Fav Place");
    }
    else {
      res.status(200).end("Added Fav Place");
    }
  });
});

////Remove Fav Place
router.post('/favRemove', function(req, res, next) {
  const email = req.body.email;
  const fav = req.body.fav;
  mysql.query( `DELETE FROM favplaces WHERE rideremail ="${email}" AND place= "${fav}" ;`, (error, result) => {
    console.log (email + fav);
    if (error) {
      console.log(error);
      res.status(401).end("Couldn't Remove Fav Place");
    }
    else {
      res.status(200).end("Removed Fav Place");
    }
  });
});

////Retrieve History
router.post('/history', function(req, res, next) {
  const email = req.body.email;
  mysql.query( `SELECT * FROM ride WHERE rideremail='${email}' OR driveremail='${email}';`, (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).end("Couldn't Retrieve History");
    }
    else {
     if(result.length !== 0)
       res.status(200).json(result);
    }
  });
});
module.exports = router;