var fs = require('fs');
var path = require('path');

var passwordFile = path.resolve(__dirname, '.smtp-password.txt');

if(!fs.existsSync(passwordFile)){
    console.error('Please set the password of smtp server in file: authentication/config/app.config.js !');
    process.exit(1);
}

var emailConfig = {
    sender      : 'smtp.facehub@gmail.com',
    password    : fs.readFileSync(passwordFile,'utf-8'),
    smtp        : 'smtp.gmail.com'
};

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        host        : 'http://authentication.facehub.net',
        application : 'http://facehub.net/', // will redirect to this url after login
        email       : emailConfig
    };
}else{
    module.exports = {
        host        : 'http://127.0.0.1:3000',
        application : 'http://127.0.0.1:8080',
        email       : emailConfig
    };
}
