const { gql } = require('apollo-server-express');
const { GraphQLScalarType }  = require('graphql');
const { Kind } = require('graphql/language');
require('dotenv').config();

const typeDefs = gql`

    scalar Date

    type industrySticker {
        id: ID
        industryName: String!
        industryRiseFall: Float!
        monthRiseFallList: [monthRiseFall]!
    }

    type monthRiseFall {
        id: ID
        dataDate: Date！
        value: Float!
        unit: String!
    }

    extend type Query {
        industryStickers: [industrySticker]!
    }

`;


const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
          return new Date(value); // value from the client
        },
        serialize(value) {
          return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
          if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10); // ast value is always in string format
          }
          return null;
        },
      }),
    Query: {
        
    }
};

module.exports = {
    typeDefs,
    resolvers
}