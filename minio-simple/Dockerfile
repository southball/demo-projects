FROM node:18-alpine
WORKDIR /workdir

RUN mkdir app

COPY package.json .
COPY yarn.lock .
COPY app/package.json app/
COPY app/yarn.lock app/

RUN yarn && cd app && yarn

COPY . .
RUN cd app && yarn build

CMD ["yarn", "start"]