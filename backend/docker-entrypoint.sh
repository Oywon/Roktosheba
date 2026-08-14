#!/bin/sh
set -e
cd /usr/src/app
npm install
npx prisma generate
npx prisma migrate deploy || true
npm run prisma:seed
npm run build
node dist/index.js
