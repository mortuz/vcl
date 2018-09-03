var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

var FormSchema = new Schema({
    // id
    name: {type: String, required: true},
    jobs: {type: String },
    header: { type: String, require: true },
    attach: { type: String, required: true },
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
    question4: { type: String, required: true },
});

module.exports = mongoose.model('Form', FormSchema);