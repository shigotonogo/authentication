npm install

kill -9 $(lsof -i:1025 -t) 2> /dev/null
node_modules/maildev/bin/maildev & 

# visit http://127.0.0.1:1080
open http://127.0.0.1:1080 2> /dev/null

NODE_ENV=development SMTP_SERVER=127.0.0.1 SMTP_PORT=1025  node app.js
