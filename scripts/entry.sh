#!/bin/bash
./scripts/wait.sh $DB_SERVER:$DB_PORT -t 0

echo "-> Starting Application..."
if [ "$NODE_ENV" = "prod" ]; then
    npm run start:prod
else
    npm run dev
fi