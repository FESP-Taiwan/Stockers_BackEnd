const { ApolloServer, gql } = require('apollo-server');
const User = require('./db/model/User');

const users = [
    {
        id: 1,
        email: 'oldmo1@example.com',
        password: 'asdf1234',
        first_name: 'Harry1',
        last_name: 'Mo'
    },
    {
        id: 2,
        email: 'oldmo2@example.com',
        password: 'asdf1234',
        first_name: 'Harry2',
        last_name: 'Mo'
    },
    {
        id: 3,
        email: 'oldmo3@example.com',
        password: 'asdf1234',
        first_name: 'Harry3',
        last_name: 'Mo'
    }
  ];
const typeDefs = gql`
    type User {
        id: ID
        email: String!
        password: String!
        first_name: String!
        last_name: String!
    }

    type Query {
        user: User!
    }

    type Mutation {
        register(email: String!,password: String!, first_name: String!, last_name: String!): User
        login(email: String!,password: String!): User
    }
`;


const resolvers = {
    Query: {
       

    },
    Mutation: {
        register(parent, args, ctx, info) {
            const user = User.build({
                email: args.email,
                password: args.password,
                first_name: args.first_name,
                last_name: args.last_name
            });
            user.save().then(() => {
                console.log('user register success')
            }).catch(() => console.log('save fail'))
            return user;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`server listening on ${url}`)
})