FROM node

WORKDIR /usr/src/app
COPY . .

RUN npm install express path mustache-express promise prom-client dotenv jsdom request

EXPOSE 8080

CMD ["npm", "start"]


#FROM navikt/node-express:12.2.0-alpine
#
#WORKDIR /src
#COPY ./dist dist
#COPY ./package.json .
#COPY ./server.js .
#
#RUN npm install
#
#CMD [ "node", "server.js" ]
