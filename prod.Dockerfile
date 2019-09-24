FROM  node:latest

RUN mkdir -p /app
WORKDIR /app

ADD package.json /app
RUN npm install

ARG NODE_ENV=prod
ENV NODE_ENV $NODE_ENV

ADD . /app
ENTRYPOINT [ "./scripts/entry.sh" ]
EXPOSE 5000
