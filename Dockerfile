FROM node:18.12-slim

ARG SLACK_BOT_TOKEN
ENV SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN}
ARG SLACK_SIGNING_SECRET
ENV SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET}
ARG SLACK_APP_TOKEN
ENV SLACK_APP_TOKEN=${SLACK_APP_TOKEN}
ARG CLICKUP_TOKEN
ENV CLICKUP_TOKEN=${CLICKUP_TOKEN}

RUN useradd -ms /bin/bash slackapp && mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . .

RUN chown slackapp /usr/src/app

USER slackapp

CMD [ "node", "app.js" ]