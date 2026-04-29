FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22-slim
WORKDIR /syfooversikt

COPY package.json ./
COPY dist-server/server.js ./
COPY dist-server/server.js.map ./
COPY dist-server/server ./server
COPY dist/index.html ./dist/index.html
COPY dist/assets ./dist/assets
COPY node_modules ./node_modules

EXPOSE 8080
USER nonroot
CMD ["./server.js"]
