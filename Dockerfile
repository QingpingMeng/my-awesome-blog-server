FROM node:10-alpine 

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn 

COPY . /app

RUN yarn run build && \
    yarn cache clean

EXPOSE 3000

CMD ["yarn", "serve"]