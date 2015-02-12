var emailConfig = {
    sender      : 'smtp.facehub@gmail.com',
    password    : process.env.password,
    smtp        : 'smtp.gmail.com'
};

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        host        : 'http://authentication.facehub.rocks',
        application : 'http://facehub.rocks/', // will redirect to this url after login

        email       : emailConfig
    };
}else{
    module.exports = {
        host        : 'http://localhost:3000',
        application : 'http://localhost:8080',

        email       : emailConfig
    };
}
