FROM node:lts-buster

WORKDIR /usr/src/app
COPY . .

RUN npm install

EXPOSE 4500

CMD npm start
