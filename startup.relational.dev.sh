#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh 34.101.117.103:5432
# npm run migration:run
npm run prisma:migrate
npm run seed:run:relational
npm run start:prod
