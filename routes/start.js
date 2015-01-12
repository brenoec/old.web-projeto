var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var Accounts = require('../models/Account');


/* GET start page. */
router.get('/', function(req, res) {
  res.render('start', { title: 'Domorrow' });
});

module.exports = router;
