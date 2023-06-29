FROM node:16-alpine as builder
WORKDIR /syfooversikt

COPY server.ts package.json tsconfig.json ./
COPY server ./server
COPY node_modules ./node_modules
COPY img ./img
COPY dist ./dist

RUN npm install -g typescript
RUN tsc --build

FROM gcr.io/distroless/nodejs16-debian11
WORKDIR /syfooversikt

COPY --from=builder /syfooversikt/package.json ./
COPY --from=builder /syfooversikt/dist/server.js ./
COPY --from=builder /syfooversikt/dist/server.js.map ./
COPY --from=builder /syfooversikt/dist/server ./server
COPY --from=builder /syfooversikt/dist/index.html ./dist/index.html
COPY --from=builder /syfooversikt/dist/main.bundle.js ./dist/main.bundle.js
COPY --from=builder /syfooversikt/node_modules ./node_modules
COPY --from=builder /syfooversikt/img ./img

EXPOSE 8080
USER nonroot
CMD ["./server.js"]
