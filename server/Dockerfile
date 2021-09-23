FROM node:14-alpine as base
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install -g typescript
RUN npm i
#RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node

FROM base as production
ENV NODE_PATH=./dist
RUN npm run build


