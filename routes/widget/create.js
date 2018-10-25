var express = require('express');
var router = express.Router();
var Form = require('../../models/form');

router.get('/', function (req, res){
    res.render('widget/create', { title: 'VCL' });
});

router.post('/', function(req, res) {
    // console.log(req.body.header);
    var form = new Form();
    form.name = req.body.name || 'Untitled';
    form.jobs = req.body.jobs;
    form.header = req.body.header;
    form.attach = req.body.attach;
    form.question1 = req.body.q1;
    form.question2 = req.body.q2;
    form.question3 = req.body.q3;
    form.question4 = req.body.q4;
    form.question4 = req.body.q4;
    form.colors.theme_color = req.body.theme_color;
    form.colors.input_text_color = req.body.input_text_color;
    // form.colors.input_bg_color = req.body.input_bg_color;
    form.colors.header_text_color = req.body.header_text_color;
    form.colors.popover_text_color = req.body.popover_text_color;
    form.colors.popover_bg_color = req.body.popover_bg_color;
    form.user = req.session.user;

    form.save((err, form) => {
        if (err) {
            res.render('widget/create', {
                errors: err,
                data: form
            });
            console.log(err);
        } else {
            // console.log(form);
            res.render('widget/index', { id: form._id });
        }
    })
    
})

module.exports = router;