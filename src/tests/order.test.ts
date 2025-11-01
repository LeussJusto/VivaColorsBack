import request from "supertest";
import { createApp } from "../app";
import type { Express } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "../infrastructure/db/mongo/models/UserModel";
import { ProductModel } from "../infrastructure/db/mongo/models/ProductModel";
import { OrderModel } from "../infrastructure/db/mongo/models/OrderModel";

let app: Express;
let token: string;
let orderId: string;
let productId: string;

beforeAll(async () => {
  app = (await createApp()).app;

  // Crear usuario admin para autenticación
  const existingUser = await UserModel.findOne({ email: "admin_orders@example.com" });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await UserModel.create({
      name: "Admin Orders",
      email: "admin_orders@example.com",
      password: hashedPassword,
      role: "admin",
    });
  }

  // Login y obtener token
  const loginRes = await request(app)
    .post("/graphql")
    .send({
      query: `
        mutation {
          loginUser(input: { email: "admin_orders@example.com", password: "123456" }) {
            token
          }
        }
      `,
    })
    .expect(200);

  token = loginRes.body.data.loginUser.token;

  // Crear un producto de prueba (necesario para la orden)
  const productRes = await request(app)
    .post("/graphql")
    .set("Authorization", `Bearer ${token}`)
    .send({
      query: `
        mutation {
          createProduct(input: {
            name: "Test Product Order",
            description: "Product for order test",
            price: 50.0,
            stock: 5
          }) {
            id
            name
            price
          }
        }
      `,
    })
    .expect(200);

  productId = productRes.body.data.createProduct.id;
});

afterAll(async () => {
  await OrderModel.deleteMany({});
  await ProductModel.deleteMany({});
  await UserModel.deleteOne({ email: "admin_orders@example.com" });
  await mongoose.disconnect();
});

describe("Order GraphQL", () => {
  test("Create Order", async () => {
    const mutation = {
      query: `
        mutation CreateOrder($input: CreateOrderInput!) {
          createOrder(input: $input) {
            id
            total
            status
          }
        }
      `,
      variables: {
        input: {
          items: [{ product: productId, quantity: 2, price: 50.0 }],
          total: 100.0
        }
      }
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(mutation);
    
    console.log('Create Order Response:', res.body); // Para ver el error específico

    expect(res.body.data.createOrder.total).toBe(100.0);
    expect(res.body.data.createOrder.status).toBe("PENDIENTE");
    orderId = res.body.data.createOrder.id;
  });

  test("Get All Orders", async () => {
    const query = {
      query: `
        query {
          orders {
            id
            total
            status
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(query)
      .expect(200);

    expect(res.body.data.orders.length).toBeGreaterThan(0);
  });

  test("Update Order Status", async () => {
    const mutation = {
      query: `
        mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
          updateOrderStatus(id: $id, status: $status) {
            id
            status
          }
        }
      `,
      variables: {
        id: orderId,
        status: "ENVIADO"
      }
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(mutation)
      .expect(200);

    expect(res.body.data.updateOrderStatus.status).toBe("ENVIADO");
  });

  test("Delete Order", async () => {
    const mutation = {
      query: `
        mutation DeleteOrder($id: ID!) {
          deleteOrder(id: $id) {
            id
            total
          }
        }
      `,
      variables: {
        id: orderId
      }
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(mutation)
      .expect(200);

    expect(res.body.data.deleteOrder.id).toBe(orderId);
  });
});
