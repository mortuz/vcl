var express = require('express');
var router = express.Router();
var Form = require('../models/form');

router.get('/', function(req, res){
    // 5b8624dd482a7c05a4360171
    console.log(req.query.id);
    Form.findOne({ _id: req.query.id }, (err, form) => {
        res.render('render/index.ejs', { form: form });
    });
})

module.exports = router;