var express = require('express');
var router = express.Router();
var Form = require('../../models/form');
var app = express();
router.get('/', function (req, res){
    res.render('widget/create', { title: 'VCL' });
});

router.post('/', function(req, res) {
    // console.log(req.body.header);
    var form = new Form();
    form.name = req.body.name;
    form.jobs = req.body.jobs;
    form.header = req.body.header;
    form.attach = req.body.attach;
    form.questions = req.body.questions;
    form.colors.theme_color = req.body.theme_color;
    form.colors.input_text_color = req.body.input_text_color;
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
            var baseUrl = app.get("env") === "development" ? "http://localhost:3000" : "https://vcl.fidiyo.com";
            // console.log(form);
            res.render('widget/index', { id: form._id, baseUrl: baseUrl });
        }
    })
    
})

module.exports = router;