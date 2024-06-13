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

FROM postgres:16-alpine
# On Windows root will own the files, and they will have permissions 755
COPY server/cert/key.pem /var/lib/postgresql/key.pem
COPY server/cert/cert.pem /var/lib/postgresql/cert.pem
# update the privileges on the .key
RUN chmod 600 /var/lib/postgresql/key.pem
RUN chown postgres:postgres /var/lib/postgresql/key.pem