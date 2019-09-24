const passport = require('passport');
const fbStrategy = require('passport-facebook');
const googleStrategy = require('passport-google-oauth20').Strategy;
const { OauthUser } = require('../db/model/User');
const SECRET = process.env.SECRET;

passport.use(
    new fbStrategy(
        {
            clientID: process.env.FB_CLIENT_ID,
            clientSecret: process.env.FB_CLIENT_SECRET,
            callbackURL: process.env.FB_CALLBACK_URL
        },

        async (accessToken, refreshToken, profile, cb) => {
            try{
                const user = await OauthUser.findOne({
                    where: {
                        userId: profile.id
                    }
                });

                if(user) {
                    cb(null, [user,accessToken]);
                }else {

                    let oauthUser = await OauthUser.build({
                        userId: profile.id,
                        name: profile.displayName
                    });

                    const savedoauthUser = await oauthUser.save();
                    cb(null, [savedoauthUser,accessToken])
                }

                cb(null, [profile,accessToken])

            } catch(err) {
                console.log(err)
            }
        }
    )
);


passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, cb)  => {
    try{
        const user = await OauthUser.findOne({
            where: {
                userId: profile.id
            }
        });

        if(user) {
            cb(null, [user,accessToken]);
        }else {

            let oauthUser = await OauthUser.build({
                userId: profile.id,
                name: profile.displayName
            });

            const savedoauthUser = await oauthUser.save();
            cb(null, [savedoauthUser,accessToken])
        }

        cb(null, [profile,accessToken])
    } catch(err) {
        console.log(err);
    }
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });

passport.deserializeUser(function(user, done) {
    done(null, user);
  });

module.exports = passport;