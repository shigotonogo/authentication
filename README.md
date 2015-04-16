howto run this app?
===================

1. start redis server
2. run `npm install`

3. run the application(please set the __password__ of smtp server in config/.smtp-password.txt)
    1. in __development__ mode
    `sh start-dev.sh` 
    2. in __production__ mode
    `sh start-production.sh` 


the Login / Register API: 
===========================
1. `http://localhost:3000/sendtoken` in development env.
2. `http://authentication.facehub.rocks/sendtoken` in production env.
3. the data should contains a `user` field. You can POST the data by submit a `<form/>` or  use AJAX XMLHttpRequest.


the logout API
======================
1. `http://localhost:3000/logout` in development env.
2. `http://authentication.facehub.rocks/logout` in production env.
