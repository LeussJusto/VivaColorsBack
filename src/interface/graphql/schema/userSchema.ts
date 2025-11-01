import { gql } from "graphql-tag";

export const userSchema = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    users: [User!]!
  }

  type Mutation {
    registerUser(input: RegisterInput!): User!
    loginUser(input: LoginInput!): AuthPayload!
    logoutUser: Boolean!
  }
`;
