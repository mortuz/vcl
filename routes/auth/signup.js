const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");
var secret = "ssshhhhkoihai";
var User = require('../../models/user');

var mailer = require('../../utils/mailer');

router.get('/', function(req, res) {
    res.render('auth/signup');
})

router.post('/', function(req, res) {
    req.check("fname", "First name must not be empty").isLength({min: 1});
    req.check("lname", "Last name must not be empty").isLength({min: 1});
    req.check("company", "Company name must not be empty").isLength({min: 3});
    req.check("position", "Position must not be empty").isLength({min: 3});
    req.check("phone", "Phone must not be empty").isLength({min: 5});
    req.check("email", "Invalid email address").isEmail();
    req
      .check("password", "Password must have atleast 4 characters")
      .isLength({ min: 4 });
    req.check("confirm_password", "Password do not match").matches(req.body.password);

    var errors = req.validationErrors();
    console.log(errors);

    if (errors) {
        res.render("auth/signup", { errors: errors });
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
                var emailContent = `
                <p>Welocome to <strong>VCL</strong>. Activate your account http://localhost:3000/auth/activate/?token=${token}
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