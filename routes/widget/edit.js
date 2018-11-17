const express = require('express');
var router = express.Router();
var Form = require("../../models/form");

var app = express();

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

    form.save((err, form) => {
      if (err) {
        req.flash("error", "Unable to update widget.");
        res.render('widget/edit', {
          errors: err,
          form: form
        });
        // console.log(err);
      } else {
        req.flash("success", "No need to update your code, your changes are automatically linked to the original code.");
        var baseUrl = app.get("env") === "development" ? "http://localhost:3000" : "https://vcl.fidiyo.com";
        res.render('widget/index', { id: req.body.form_id, baseUrl: baseUrl });
      }
    })

  });
  

})

module.exports = router;