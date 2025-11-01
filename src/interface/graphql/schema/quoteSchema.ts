import { gql } from "graphql-tag";

export const quoteSchema = gql`
  type QuoteItem {
    product: ID!
    quantity: Int!
    price: Float!
  }

  type Quote {
    id: ID!
    user: ID!
    items: [QuoteItem!]!
    total: Float!
    status: String!
    rejectionReason: String
    createdAt: String!
  }

  input QuoteItemInput {
    product: ID!
    quantity: Int!
    price: Float!
  }

  input CreateQuoteInput {
    items: [QuoteItemInput!]!
    total: Float!
  }

  enum QuoteStatus {
    pendiente
    aprobada
    rechazada
  }

  type Query {
    quotes: [Quote!]!
    quote(id: ID!): Quote
  }

  type Mutation {
    createQuote(input: CreateQuoteInput!): Quote!
    updateQuoteStatus(id: ID!, status: QuoteStatus!, rejectionReason: String): Quote!
    deleteQuote(id: ID!): Quote!
  }
`;
