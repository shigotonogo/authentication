module.exports = {
    host        : 'http://authentication.facehub.net/',
    callbackUrl : 'http://facehub.net/', // will redirect to this url after login

    email       : {
        sender      : 'smtp.facehub@gmail.com',
        password    : process.env.password,
        smtp        : 'smtp.gmail.com'
    } 
};