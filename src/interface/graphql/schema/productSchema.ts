import { gql } from "graphql-tag";

export const productSchema = gql`
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    createdAt: String!
  }

  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    stock: Int!
  }

  input UpdateProductInput {
    id: ID!
    name: String
    description: String
    price: Float
    stock: Int
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Product!
  }
`;
