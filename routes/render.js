var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var app = express();

router.get('/', function(req, res){
    var baseUrl = app.get("env") === "development" ? "http://localhost:3000" : "https://vcl.fidiyo.com";
    Form.findOne({ _id: req.query.id }, (err, form) => {
        res.render('render/index.ejs', { form: form, baseUrl: baseUrl });
    });
})

module.exports = router;