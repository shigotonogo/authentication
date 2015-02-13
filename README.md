howto run this app?
===================

1. start redis server
2. run `npm install`

3. run the application(please change the __password__ for smtp server)
    1. in __development__ mode
    `password=foobar node app.js` 
    2. in __production__ mode
    `password=foobar NODE_ENV=production node app.js` 


the Login / Register API: 
===========================
1. `http://localhost:3000/sendtoken` in development env.
2. `http://authentication.facehub.rocks/sendtoken` in production env.
3. the data should contains a `user` field. You can POST the data by submit a `<form/>` or  use AJAX XMLHttpRequest.


the logout API
======================
1. `http://localhost:3000/logout` in development env.
2. `http://authentication.facehub.rocks/logout` in production env.
