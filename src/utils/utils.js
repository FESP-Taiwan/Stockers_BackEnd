const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config =require('config');//require('dotenv').config();
const SALT_ROUNDS = Number(config.get('SALT_ROUNDS'));
const SECRET = config.get('SECRET');


const hash = text => bcrypt.hash(text, SALT_ROUNDS);

const createToken = ({email, password}) => jwt.sign({email, password}, SECRET, {
    expiresIn: '1d'
});

const isAuthenticated = resolverFunc => (parent, args, context) => {
    if(!context.me) throw new ForbiddenError('Not logged in');
    return resolverFunc.apply(null, [parent, args, context]);
};

module.exports = {
    hash,
    createToken,
    isAuthenticated
}