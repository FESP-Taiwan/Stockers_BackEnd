const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const SECRET = process.env.SECRET;


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