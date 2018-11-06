var express = require("express");
var jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
var secret = "ssshhhhkoihai";
var User = require("../models/user");
var Form = require('../models/form');
var router = express.Router();

router.get('/:id', (req, res) => {
    var id = req.param.id;
    Form.findOne({ _id: req.params.id }, (err, form) => {
      if (err) {
        throw err;
      } else {
        if (!form) {
          console.log(form);
          req.flash("error", "Unable to perform this action.");
          res.redirect("/widgets");
        } else {
          if (form.user != req.session.user) {
            // user not permitted
            req.flash("error", "You are not permitted!");
            res.redirect("/widgets");
          } else {
            Form.deleteOne({ _id: id }, err => {
              form.remove();
              console.log();
              if (err) {
                throw err;
              } else {
                // deleted
                req.flash("success", "Widget successfully deleted.");
                res.redirect("/widgets");
              }
            });
          }
        }
      }
    });
})

module.exports = router;