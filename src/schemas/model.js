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
        value: 14.78,
        unit: '%'
      },
      {
        id: 002,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 14.20,
        unit: '%'
      },
      {
        id: 003,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 11.78,
        unit: '%'
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
        value: 1.78,
        unit: '%'
      },
      {
        id: 005,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 18.20,
        unit: '%'
      },
      {
        id: 006,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 89.78,
        unit: '%'
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
        value: 14.78,
        unit: '%'
      },
      {
        id: 8,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 15.20,
        unit: '%'
      },
      {
        id: 9,
        dataDate: "2018-10-10T10:10:10.000Z",
        value: 5.78,
        unit: '%'
      }
    ]
  }
]

const typeDefs = gql`
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
        unit: String!
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