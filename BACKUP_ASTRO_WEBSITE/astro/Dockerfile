# FROM node:21-alpine3.18
FROM node:20-alpine
RUN apk update && apk upgrade && apk add bash busybox-extras
RUN apk add curl

RUN rm /app/node_modules -rf
RUN rm astro/app/node_modules/ -rf
RUN npm install -g pnpm
RUN pnpm config set store-dir .pnpm-store --global
WORKDIR /app

COPY ./astro/app/package*.json ./
COPY ./astro/app/pnpm-lock.* ./ 
# RUN pnpm install

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

COPY ./astro/cron/startup.sh /cron/
RUN chmod +x /cron/startup.sh
CMD /cron/startup.sh


# TEMP
# RUN sleep 5
# RUN pnpm install
# CMD ["node", "-e", "const http = require('http'); const PORT = 4321; http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/plain'}); res.end('Hello World'); }).listen(PORT, () => console.log('Server running on port ' + PORT))"]
# RUN pnpm config set store-dir /root/.local/share/pnpm/store/ --global

