var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

var FormSchema = new Schema({
    // id
    name: {type: String, required: true},
    jobs: {type: String, required: true },
    header: { type: String, require: true },
    attach: { type: String, required: true },
    question1: { type: String, required: true },
    question2: { type: String, required: true },
    question3: { type: String, required: true },
    question4: { type: String, required: true },
    colors: {
        theme_color: { type: String, required: true },
        input_text_color: { type: String, required: true },
        header_text_color: { type: String, required: true },
        popover_text_color: { type: String, required: true },
        popover_bg_color: { type: String, required: true }
    },
    user: { type: String, required: true }
});

module.exports = mongoose.model('Form', FormSchema);