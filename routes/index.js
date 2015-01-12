var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var mongoose = require('mongoose');

var Accounts = Account = require('../models/Account');

/* GET home page. */
router.get('/', function(req, res) {
  var message = req.session.error;
  req.session.error = '';

  res.render('index', { title: 'Domorrow', error: message });
});

/* POST home page */
router.post('/', function(req, res) {
  var form = req.body;

  if (form.type === 'register') {

    var account;

    var chain = [

      // verify if user exists
      function() {
        // TODO: ajax
        Accounts.findOne({ 'email': form.email }, function(err, data) {
          if (data) {
            req.session.error = 'E-mail has already been registered.'
            res.redirect(409, 'start');
          } else {
            chain.shift()();
          }
        });
      },

      // crypt pass
      function() {
        var hash = crypto.createHash('md5').update(form.password).digest('hex');
        form.password = hash;

        chain.shift()();
      },

      // save
      function() {
        account = new Account(form);
        account.save(function(err) {
          if (err) throw err;
          res.status(201);
        });

        chain.shift()();
      },

      // open session, redirect to start
      function() {
        req.session.active = true;
        req.session.email = account.email;

        res.redirect('start');
      }
    ];

    chain.shift()();

  } else if (form.type === 'sign in') {

    var account;

    var chain = [

      function() {
        Accounts.findOne({ 'email': form.email }, function(err, data) {
          if (data) {
            account = data;

            chain.shift()();
          } else {
            req.session.error = 'The e-mail and password did not match.';
            res.status(401);
            res.redirect('/');
          }
        });
      },

      // verify password
      function() {
        var hash = crypto.createHash('md5').update(form.password).digest('hex');

        if (account.password === hash) {
          chain.shift()();
        } else {
          req.session.error = 'The e-mail and password did not match.';
          res.status(401);
          res.redirect('/');
        }
      },

      // open session, redirect to start
      function() {
        req.session.active = true;
        req.session.email = account.email;

        res.redirect('start');
      }
    ];

    chain.shift()();

  } else {
    throw new Error('No such form type.');
  }
});

module.exports = router;
