FROM node:18-alpine AS builder
WORKDIR /syfooversikt

COPY server.ts package.json tsconfig.json ./
COPY server ./server
COPY node_modules ./node_modules
COPY img ./img
COPY dist ./dist

RUN npm install -g typescript
RUN tsc --build

FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /syfooversikt

COPY --from=builder /syfooversikt/package.json ./
COPY --from=builder /syfooversikt/dist/server.js ./
COPY --from=builder /syfooversikt/dist/server.js.map ./
COPY --from=builder /syfooversikt/dist/server ./server
COPY --from=builder /syfooversikt/dist/index.html ./dist/index.html
COPY --from=builder /syfooversikt/dist/main.bundle.js ./dist/main.bundle.js
COPY --from=builder /syfooversikt/dist/main.bundle.js.map ./dist/main.bundle.js.map
COPY --from=builder /syfooversikt/dist/styles.css ./dist/styles.css
COPY --from=builder /syfooversikt/dist/styles.css.map ./dist/styles.css.map
COPY --from=builder /syfooversikt/node_modules ./node_modules
COPY --from=builder /syfooversikt/img ./img

EXPOSE 8080
USER nonroot
CMD ["./server.js"]
