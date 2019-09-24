FROM  node:latest

RUN mkdir -p /app
WORKDIR /app

ADD package.json /app
RUN npm install

ADD . /app

CMD ["npm","run","dev"]
