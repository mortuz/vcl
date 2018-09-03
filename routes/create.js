var express = require('express');
var router = express.Router();
var Form = require('../models/form');

router.get('/', function (req, res){
    res.render('create/index', { title: 'VCL' });
});

router.post('/', function(req, res) {
    console.log(req.body.header);
    var form = new Form();
    form.name = req.body.name || 'Untitled';
    form.jobs = req.body.jobs;
    form.header = req.body.header;
    form.attach = req.body.attach;
    form.question1 = req.body.q1;
    form.question2 = req.body.q2;
    form.question3 = req.body.q3;
    form.question4 = req.body.q4;

    form.save((err, form) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(form);
            res.render('create/index', { id: form._id });
        }
    })
    
})

module.exports = router;