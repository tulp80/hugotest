#!/bin/bash
cd /app/ 
pnpm install
pnpm run dev --host 
sleep 10000000000000000


# test
# sleep 5
# node -e "const http = require('http'); const PORT = 4321; http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/plain'}); res.end('Hello World'); }).listen(PORT, () => console.log('Server running on port ' + PORT))"
