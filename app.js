const { ApolloServer, gql, ForbiddenError } = require('apollo-server');
const User = require('./db/model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const SALT_ROUNDS = 8;
const SECRET = 'testsecret';

// helper function
const hash = text => bcrypt.hash(text, SALT_ROUNDS);
const createToken = ({email, password}) => jwt.sign({email, password}, SECRET, {
    expiresIn: '1d'
});
const isAuthenticated = resolverFunc => (parent, args, context) => {
    if(!context.me) throw new ForbiddenError('Not logged in');
    return resolverFunc.apply(null, [parent, args, context]);
};


const typeDefs = gql`
    type User {
        id: ID!
        email: String!
        password: String!
        first_name: String!
        last_name: String!
    }

    type Token {
        token: String!
    }

    type Query {
        user: User!
    }

    type Mutation {
        signUp(email: String!,password: String!, first_name: String!, last_name: String!): User
        logIn(email: String!,password: String!): Token
    }
`;


const resolvers = {
    Mutation: {
        signUp: async (parent, args, ctx, info) => {
            // 還需檢查是否有相同 email
            // id在query抓不到
            const hashedPassword = await hash(args.password, SALT_ROUNDS);

            const user = await User.build({
                email: args.email,
                password: hashedPassword,
                first_name: args.first_name,
                last_name: args.last_name
            });
            user.save().then(() => {
                console.log('user register success')
            }).catch(() => console.log('save fail'))
            return user;
        },
        logIn: async (root, { email, password }, context) => {
            const user = await User.findOne({ where: {email}});
            if(!user)
                throw new Error('Can not find the user');

            const passwordIsValid = await bcrypt.compare(password, user.password);
            if(!passwordIsValid)
                throw new Error('Wrong password');
            
                return { token: await createToken(user) }
        }
    }
};

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