FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /syfooversikt

COPY package.json ./
COPY dist-server/server.js ./
COPY dist-server/server.js.map ./
COPY dist-server/server ./server
COPY dist/index.html ./dist/index.html
COPY dist/main.bundle.js ./dist/main.bundle.js
COPY dist/main.bundle.js.map ./dist/main.bundle.js.map
COPY dist/styles.css ./dist/styles.css
COPY dist/styles.css.map ./dist/styles.css.map
COPY node_modules ./node_modules
COPY img ./img

EXPOSE 8080
USER nonroot
CMD ["./server.js"]
