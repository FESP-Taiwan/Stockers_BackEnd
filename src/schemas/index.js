const { gql }  = require('apollo-server-express');
const userSchema = require('./user');
const mainpageShame = require('./mainpage');

const typeDefs = gql`
  type Query {
    hello: String
  }

  type Mutation {
    test: Boolean
  }
`

const resolvers = {
    Query: {
      hello: () => 'world'
    },
    Mutation: {
      test: () => true
    }
}

module.exports = {
  typeDefs: [typeDefs, userSchema.typeDefs, mainpageShame.typeDefs],
  resolvers: [resolvers, userSchema.resolvers, mainpageShame.resolvers]
}
// mainpageShame.typeDefs
//, mainpageShame.resolvers