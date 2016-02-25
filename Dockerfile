FROM node:5.7.0-wheezy

COPY . /authentication 

RUN npm install

EXPOSE 3000

CMD cd authetication && NODE_ENV=production  node app.js