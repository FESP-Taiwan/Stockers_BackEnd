const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { typeDefs, resolvers } = require('./schemas/index');
require('dotenv').config()
const passport = require('passport');
const fbStrategy = require('passport-facebook');
const { User, OauthUser } = require('./db/model/User');
const SECRET = process.env.SECRET;
const PORT = process.env.PORT || 5000;


const app = express();

passport.use(
    new fbStrategy(
        {
            clientID: process.env.FB_CLIENT_ID,
            clientSecret: process.env.FB_CLIENT_SECRET,
            callbackURL: process.env.FB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, cb) => {
            const user = await OauthUser.findOne({
                where: {
                    id: profile.id
                }
            });
            if(user) {
                cb(null, user);
            }else {
                let oauthUser = await OauthUser.build({
                    name: 'hello'
                });
                const savedoauthUser = await oauthUser.save();
                cb(null, savedoauthUser,accessToken)
            }
            
            cb(null, [profile,accessToken])
        }
    )
);
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });

app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = new ApolloServer({
    typeDefs,
    resolvers,
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

app.get('/test',(req,res) => {
    res.send('trest');
})

app.get('/fblogin', passport.authenticate('facebook',{authType: 'reauthenticate'}));
app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/test' }),
    async (req, res) => {
        console.log(req.user[0])
        const token = req.user[1];
        res.send(token)
    })

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/test');
});

server.applyMiddleware({ app });

app.listen(PORT,() => {
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
})
