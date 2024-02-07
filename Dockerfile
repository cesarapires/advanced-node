FROM node:16.4

RUN mkdir /usr/src/app && chown node:node /usr/src/app

WORKDIR /usr/src/app

USER node

COPY --chown=node:node package.json package-lock.json* ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "start"]
