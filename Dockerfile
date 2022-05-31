FROM node:14-alpine
WORKDIR /syfooversikt

COPY server.ts package.json ./

COPY node_modules ./node_modules
COPY img ./img
COPY dist ./dist
COPY changelogs ./changelogs
COPY server ./server

RUN npm install -g ts-node typescript

EXPOSE 8080
CMD ["ts-node", "server.ts"]
