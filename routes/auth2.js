var express = require('express');
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var secret = 'ssshhhhkoihai';
var User = require('../models/user');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
    secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
      user: 'mortuzalam@gmail.com',
      pass: 'wtdajwdwaddTAZ1'
    }
  });

var router = express.Router();

router.post('/signup', function( req, res ) {
  var email = req.param('email');
  var password = req.param('password');
  var uuid = req.param('uuid');
  if(!uuid) {
    res.json({
      success: false,
      message: "Device id not available"
    });
  }

    // check errors
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password must have atleast 4 characters').isLength({ min: 4});
    var errors = req.validationErrors();

    if(errors) {
      res.json({
        success: false,
        message: "Could not create your account",
        errors: errors
      });
    } else {
        // set verify token
        var token = jwt.sign({ email: email}, secret);

        // register user
        var user = new User();
        user.email = email;
        user.password = password;
        user.active_token = token;
        user.save(function(err){
          if(err) {
            res.json({
              success: false,
              message: 'Email/Mobile is already exists'
            })
          } else {

            // send mail
            // setup email data with unicode symbols
            let mailOptions = {
              from: '"Animango team" <animango@idevia.in>', // sender address
              to: email, // list of receivers
              subject: 'Verify Email', // Subject line
              html: `
              <b>Hello,</b><br/>
              <p>You need to verify your email. To activate your account please click the link below</p>
              <a href="https://animango.herokuapp.com/user/email/active?t=${token}">${token}</a>
              `
            };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    return console.log(error);
                  }
                  console.log('Message %s sent: %s', info.messageId, info.response);
                });

                // send response
                res.json({
                  success: true,
                  message: 'Your account is created. Please check your email for activation link.'
                });
              }
            });
        
      }
    });

router.post('/signin', function ( req, res ) {
  var email = req.param('email');
  var password = req.param('password');
  var playerId = req.param('playerId');
    // check errors
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password must have atleast 4 characters').isLength({ min: 4});

    var errors = req.validationErrors();

    if(errors) {
      res.json({
        success: false,
        message: "Could not log you in",
        errors: errors
      });
    } else {
      User.findOne({ email: email })
      .select('email password playerIds token')
      .exec(function(err, user) {
        if(err) throw err;
        if(!user) {
          res.json({
            success: false,
            message: 'Invalid credentials'
          });

        } else if ( user ) {
          var validPassword = user.comparePassword(password);
          console.log(validPassword);
          if(!validPassword) {
            res.json({
              success: false,
              message: 'Password does not match'
            });
          } else {
            var token = '';
            if(!user.token) {
              const userToken = { email: email };
              token = jwt.sign( userToken, secret);
              user.token = token;
            } else {
              token = user.token;
            }
            
            if (user.playerIds.indexOf(playerId) === -1) {
              user.playerIds.push(playerId);
            }
            user.password = password;
            user.save(function(err) {
              if(err) throw err;
              else {
                res.json({
                  success: true,
                  token: token
                });
              }
            });
          }
        }
      });
    }
  });

module.exports = router;