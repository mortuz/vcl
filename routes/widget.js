var express = require("express");
var jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
var secret = "ssshhhhkoihai";
var User = require("../models/user");
var Form = require('../models/form');
var router = express.Router();

router.get('/:id', (req, res) => {
    var id = req.param.id;
    Form.findOne({_id: id}, (err, form) => {
        if (err) {
            throw err;
        } else {
            if (!form) {
                res.redirect('/widgets');
            } else {
                if (form.user != req.session.user) {
                    // user not permitted
                    res.redirect("/widgets");
                } else {
                    Form.deleteOne({ _id: id }, (err) => {
                        if (err) {
                            throw err;
                        } else {
                            // deleted 
                            res.redirect('/widgets');
                        }
                    })
                }
            }
        }
    })
})

module.exports = router;