var express = require('express');
var router = express.Router();

var moment = require('moment');

var mongoose = require('mongoose');

var Tasks = Task = require('../models/Task');

/* GET start page. */
router.get('/', function(req, res) {
  var message = req.session.error;
  req.session.error = '';

  var tasks;

  var chain = [

    function() {
      Tasks.find({}, function (err, data) {
        tasks = data;
        chain.shift()();
      });
    },

    function() {
      for (i = 0; i < tasks.length; i++) {
        tasks[i].dueDateString = moment(tasks[i].dueDate).format('MMM/DD/YYYY');
      }

      chain.shift()();
    },

    function() {
      res.render('start', { title: 'Domorrow', error: message, active: req.session.active, tasks: tasks });
    }
  ];

  chain.shift()();
});

/* POST start page. */
router.post('/', function(req, res) {
  var task = new Task(req.body);

  task.save(function(err) {
    if (err) throw err;
    res.status(201);
  });

  res.redirect('/start');
});

module.exports = router;
