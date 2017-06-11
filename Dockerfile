FROM node:7.8.0-slim
MAINTAINER https://github.com/shpan93/vc-front

RUN yarn global add pm2 webpack

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN yarn install

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn run build

EXPOSE 8080
CMD [ "pm2", "start", "server.js", "--name", "vc-front", "--no-daemon" ]
