FROM node:16-alpine AS dist
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

FROM node:16-alpine
 
RUN apk add --no-cache bash

WORKDIR /user/src/app

COPY --from=dist dist /user/src/app/dist

COPY . /user/src/app

RUN yarn install --prod

CMD ["yarn", "run", "start:prod"]