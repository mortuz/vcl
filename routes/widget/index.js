var express = require("express");
var app = express();
var router = express.Router();

router.get('/:id', function(req, res) {
    console.log(req.params);
    var baseUrl = app.get("env") === "development" ? "http://localhost:3000" : "https://vcl.fidiyo.com";
    res.render("widget/index", { title: "VCL", id: req.params.id, baseUrl: baseUrl });
});

module.exports = router;