var express = require("express");

var router = express.Router();

router.get('/:id', function(req, res) {
    console.log(req.params);
    res.render("widget/index", { title: "VCL", id: req.params.id });
});

module.exports = router;