// maligun setup
var api_key = "key-9793adf968a4fb57cc6f619b58b98d4c";
var domain = 'idevia.in';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });


module.exports = {
    sendMail: function(to, subject, content) {
        var data = {
            from: 'iMailer <no-reply@idevia.in>',
            to: to,
            subject: subject,
            text: 'Testing some Mailgun awesomeness!',
            html: content
        };

        mailgun.messages().send(data, function (error, body) {
            console.log(body);
            return body;
        });
    }
}
