const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { typeDefs, resolvers } = require('./schemas/index');
require('dotenv').config()
const SECRET = process.env.SECRET;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // 以下為之後需要檢查是否有token
    context: async ({req}) => {
        const token = req.headers['token'];

        if(token) {
            try {
                const user = await jwt.verify(token, SECRET);
                return {user};
            } catch(e) {
                throw new Error('Your session expired. Sign in again');
            }
        }

        return {};
    }
})

server.listen().then(({ url }) => {
    console.log(`server listening on ${url}`)
})