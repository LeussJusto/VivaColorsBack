import { gql } from "graphql-tag";

export const orderSchema = gql`
  type OrderItem {
    product: ID!
    quantity: Int!
    price: Float!
  }

  type Order {
    id: ID!
    user: ID!
    items: [OrderItem!]!
    total: Float!
    status: String!
    createdAt: String!
  }

  input OrderItemInput {
    product: ID!
    quantity: Int!
    price: Float!
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
    total: Float!
  }

  enum OrderStatus {
    PENDIENTE
    PROCESANDO
    ENVIADO
    ENTREGADO
    CANCELADO
  }

  type Query {
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    deleteOrder(id: ID!): Order!
  }
`;
