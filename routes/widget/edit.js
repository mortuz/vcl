const express = require('express');
var router = express.Router();
var Form = require("../../models/form");

router.get('/:id', function(req, res) {
    Form.findOne({ _id: req.params.id }, (err, form) => {
      console.log(form);
      res.render("widget/edit.ejs", { form: form });
    });
});

router.post('/', function (req, res) {
  // console.log(req.body.header);
  console.log(req.body)
  Form.findOne({_id: req.body.form_id}, (err, form) => {

    if (err)
    console.log(err);

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
    form.colors.header_text_color = req.body.header_text_color;
    form.colors.popover_text_color = req.body.popover_text_color;
    form.colors.popover_bg_color = req.body.popover_bg_color;

    form.save((err, form) => {
      if (err) {
        req.flash('error', 'Unable to save changes. Try again!');
        res.render('widget/edit', {
          errors: err,
          data: form
        });
        // console.log(err);
      } else {
        // console.log(form);
        req.flash('success', 'Widget updated!');
        res.redirect('/widgets');
      }
    })

  });
  

})

module.exports = router;