var express = require('express');
var router = express.Router();
var Form = require("../models/form");

/* GET home page. */
router.get('/widgets', function(req, res) {
  Form.find({ user: req.session.user },(err, forms) => {
    if (err) throw err;
    console.log(req.session.user);
    res.render('index', {
      title: 'VCL',
      forms: forms
    });
  })
  
});

router.get('/', function(req, res) {
  if (req.session.user) {
    res.redirect('/widgets');
  } else {
    res.redirect('/auth/signin');
  }
  
});

module.exports = router;