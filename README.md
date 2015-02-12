howto run this app?
===================

1. start redis server
2. run `npm install`

3. please config the password for smtp server
    1. in development mode
    `password=foobar node app.js` 
    2. in production mode
    `password=foobar NODE_ENV=production node app.js` 


the Login / Register action 
===========================
1. `http://localhost:3000/sendtoken` in development env.
2. `http://authentication.facehub.net/sendtoken` in production env.


the logout action
======================
1. `http://localhost:3000/logout` in development env.
2. `http://authentication.facehub.net/logout` in production env.
