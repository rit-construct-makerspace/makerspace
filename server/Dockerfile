FROM node:14-alpine as base
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm i
COPY . .
RUN npm run build

FROM node:14-alpine as dep
WORKDIR /usr/src/app
COPY --from=base /usr/src/app/package*.json ./
COPY --from=base /usr/src/app/dist ./
RUN npm install --only=production

FROM node:14-alpine as production
WORKDIR /usr/src/app
COPY --from=dep /usr/src/app ./
COPY --from=base /usr/src/app/dist ./dist
ENV NODE_ENV=production
ENV NODE_PATH=./dist
EXPOSE 3000
CMD npm start




