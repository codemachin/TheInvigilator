var nodemailer = require("nodemailer");

//////////////////////////// setting up transport type and setting user and password////////////////////////////

exports.smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'viveksome2@gmail.com',
        pass: '*123#vivek'
    },
    tls: {rejectUnauthorized: false},
    debug:true
});