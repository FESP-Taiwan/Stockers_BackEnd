const { gql } = require("apollo-server-express");
const bcrypt = require("bcrypt");
const { hash, createToken } = require("../utils/utils");
const { User } = require("../db/model/User");
const config = require("config");
const SALT_ROUNDS = Number(config.get("SALT_ROUNDS"));

const typeDefs = gql`
  type User {
    id: ID
    email: String!
    password: String!
    name: String!
  }

  type Token {
    userID: ID
    token: String!
  }

  extend type Query {
    user: User!
  }

  extend type Mutation {
    signUp(email: String!, password: String!, name: String!): User
    logIn(email: String!, password: String!): Token
  }
`;

const resolvers = {
  Mutation: {
    signUp: async (parent, args, ctx, info) => {
      // check if the email is registered
      const alreadyRegisteredUser = await User.findOne({
        where: { email: args.email }
      });
      if (alreadyRegisteredUser) {
        throw new Error("The email is already registered.");
      }

      const hashedPassword = await hash(args.password, SALT_ROUNDS);

      const user = await User.build({
        email: args.email,
        password: hashedPassword,
        name: args.name
      });
      const savedUser = await user.save();
      if (!savedUser) {
        throw new Error("save user fail");
      }

      return savedUser;
    },
    logIn: async (root, { email, password }, context) => {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("Can not find the user");

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) throw new Error("Wrong password");

      return { token: await createToken(user), userID: user.id };
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
};
