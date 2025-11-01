import request from "supertest";
import { createApp } from "../app";
import type { Express } from "express";
import { ProductModel } from "../infrastructure/db/mongo/models/ProductModel";
import { UserModel } from "../infrastructure/db/mongo/models/UserModel";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let app: Express;
let token: string;
let productId: string;

beforeAll(async () => {
  app = (await createApp()).app;

  const existingUser = await UserModel.findOne({ email: "admin@example.com" });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await UserModel.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });
  }

  const loginRes = await request(app)
    .post("/graphql")
    .send({
      query: `
        mutation {
          loginUser(input: { email: "admin@example.com", password: "123456" }) {
            token
          }
        }
      `,
    })
    .expect(200);

  token = loginRes.body.data.loginUser.token;
});

afterAll(async () => {
  await ProductModel.deleteMany({});
  await UserModel.deleteOne({ email: "admin@example.com" });
  await mongoose.disconnect();
});

describe("Product GraphQL", () => {
  test("Create Product", async () => {
    const mutation = {
      query: `
        mutation {
          createProduct(input: {
            name: "Test Product 1",
            description: "A test product",
            price: 100.0,
            stock: 10
          }) {
            id
            name
            price
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(mutation)
      .expect(200);

    expect(res.body.data.createProduct.name).toBe("Test Product 1");
    productId = res.body.data.createProduct.id;
  });

  test("Get All Products", async () => {
    const query = {
      query: `
        query {
          products {
            id
            name
            price
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(query)
      .expect(200);

    expect(res.body.data.products.length).toBeGreaterThan(0);
  });

  test("Update Product", async () => {
    const mutation = {
      query: `
        mutation {
          updateProduct(input: { id: "${productId}", name: "Updated Product", price: 150.0 }) {
            id
            name
            price
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(mutation)
      .expect(200);

    expect(res.body.data.updateProduct.name).toBe("Updated Product");
    expect(res.body.data.updateProduct.price).toBe(150.0);
  });

  test("Delete Product", async () => {
    const mutation = {
      query: `
        mutation {
          deleteProduct(id: "${productId}") {
            id
            name
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${token}`)
      .send(mutation)
      .expect(200);

    expect(res.body.data.deleteProduct.name).toBe("Updated Product");
  });
});
