#!//bin//sh
echo "-> Starting Application..."
if [ "$NODE_ENV" = "prod" ]; then
    npm run start:prod
else
    npm run dev
fi