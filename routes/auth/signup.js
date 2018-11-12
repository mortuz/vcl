const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");
var secret = "ssshhhhkoihai";
var User = require('../../models/user');

var mailer = require('../../utils/mailer');

router.get('/', function(req, res) {
    var errors = req.session.errors || {};
    var value = req.session.formValues || {};
    req.session.errors = {};
    req.session.formValues = {};
    console.log(errors);
    res.render('auth/signup', { errors: errors, value: value });
})

router.post('/', function(req, res) {
    req.check("fname", "First name must not be empty").isLength({min: 1});
    req.check("lname", "Last name must not be empty").isLength({min: 1});
    req.check("company", "Company name must not be empty").isLength({min: 3});
    req.check("position", "Position must not be empty").isLength({min: 3});
    req.check("phone", "Invalid phone no").isLength({min: 5}).isNumeric();
    req.check("email", "Invalid email address").isEmail();
    req
      .check("password", "Password must have atleast 4 characters")
      .isLength({ min: 4 });
    req.check("confirm_password", "Password do not match").matches(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        var formatterErrors = {};
        errors.forEach(err => {
          formatterErrors[err.param] = err.msg;
        });
        req.session.errors = formatterErrors;
        req.session.formValues = req.body;

        res.redirect("/auth/signup");
    } else {
        // redirect to signin
        // set token
        var token = jwt.sign({ email: req.body.email }, secret);

        var user = new User();

        user.first_name = req.body.fname;
        user.last_name = req.body.lname;
        user.company_name = req.body.company;
        user.position = req.body.position;
        user.password = req.body.password;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.active_token = token;
        user.save((err) => {
            if (err) {
                // email or phone already registered
                req.flash('error', 'Email is already registered.');
                res.render("auth/signup", { success: false, message: "Email or phone already taken" });
                console.log(err);
            } else {
                // send email
                var app = express();
                var baseUrl = app.get("env") === "development" ? "http://localhost:3000" : "https://vcl.fidiyo.com";
                var emailContent = `
                <p>Welocome to <strong>VCL</strong>. Activate your account <a href="${baseUrl}/auth/activate/?token=${token}">${baseUrl}/auth/activate/?token=${token}</a>
            `;
                mailer.sendMail(req.body.email, 'Welcome to VCL', emailContent);

                req.flash('info', "Activation instruction has been sent to your account.");
                // redirect to signin
                res.redirect('/auth/signin');
            }

        })
    }
})

module.exports = router;