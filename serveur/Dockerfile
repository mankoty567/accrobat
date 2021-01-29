FROM node:14
MAINTAINER Jules Poulain <jules.poulain@etu.unistra.fr>
ENV NODE_ENV=production

COPY ./ /app
WORKDIR /app

RUN npm install

EXPOSE 1418
CMD npm run start