const { gql } = require('apollo-server-express');
const { DateTimeResolver } = require('graphql-scalars');


const fakeData = [
  {
    id: 1,
    industryName: 'microsoft',
    industryRiseFall: 10.46,
    monthRiseFallList: [
      {
        id: 001,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 14.78
      },
      {
        id: 002,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 14.20
      },
      {
        id: 003,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 11.78
      }
    ]
  },
  {
    id: 2,
    industryName: 'airbnb',
    industryRiseFall: 34.67,
    monthRiseFallList: [
      {
        id: 004,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 1.78
      },
      {
        id: 005,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 18.20
      },
      {
        id: 006,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 89.78
      }
    ]
  },
  {
    id: 3,
    industryName: 'google',
    industryRiseFall: 50.46,
    monthRiseFallList: [
      {
        id: 007,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 14.78
      },
      {
        id: 8,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 15.20
      },
      {
        id: 9,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 5.78
      }
    ]
  }
]

const typeDefs = gql`

    scalar DateTime

    type industrySticker {
        id: ID
        industryName: String!
        industryRiseFall: Float!
        monthRiseFallList: [monthRiseFall]!
    }

    type monthRiseFall {
        id: ID
        dataDate: DateTime!
        value: Float!
    }

    extend type Query {
        industryStickers: [industrySticker]!
    }

`;


const resolvers = {
    Query: {
        industryStickers(parent, args, ctx, info) {
          return fakeData;
        }
    },
    DateTime: DateTimeResolver
};

module.exports = {
    typeDefs,
    resolvers
}