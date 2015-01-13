var express = require('express');
var router = express.Router();

/* GET start page. */
router.get('/', function(req, res) {
  res.render('help', { title: 'Domorrow' });
});

module.exports = router;
