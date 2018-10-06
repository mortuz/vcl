var express = require('express');
var router = express.Router();
var Form = require("../models/form");

/* GET home page. */
router.get('/', function(req, res) {
  Form.find((err, forms) => {
    if (err) throw err;
    console.log(forms);
    res.render('index', {
      title: 'VCL',
      forms: forms
    });
  })
  
});

module.exports = router;