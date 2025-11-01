import request from "supertest";
import { createApp } from "../app";
import type { Express } from "express";
import { UserModel } from "../infrastructure/db/mongo/models/UserModel";
import { ProductModel } from "../infrastructure/db/mongo/models/ProductModel";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let app: Express;
let tokenUser: string;
let tokenAdmin: string;
let productId: string;
let quoteId: string;

beforeAll(async () => {
  app = (await createApp()).app;

  const emailUser = "quoteuser@example.com";
  const password = await bcrypt.hash("123456", 10);
  let user = await UserModel.findOne({ email: emailUser });
  if (!user) {
    user = await UserModel.create({
      name: "Quote Tester",
      email: emailUser,
      password,
      role: "user",
    });
  }

  const emailAdmin = "adminquote@example.com";
  const passwordAdmin = await bcrypt.hash("123456", 10);
  let admin = await UserModel.findOne({ email: emailAdmin });
  if (!admin) {
    admin = await UserModel.create({
      name: "Quote Admin",
      email: emailAdmin,
      password: passwordAdmin,
      role: "admin",
    });
  }

  const product = await ProductModel.create({
    name: "Guitarra Eléctrica",
    description: "Guitarra de prueba",
    price: 500,
    stock: 10,
  });
  productId = (product._id as any).toString();

  const loginUserQuery = {
    query: `
      mutation {
        loginUser(input: { email: "${emailUser}", password: "123456" }) {
          token
        }
      }
    `,
  };
  const loginUserRes = await request(app).post("/graphql").send(loginUserQuery);
  tokenUser = loginUserRes.body.data.loginUser.token;

  // Login admin
  const loginAdminQuery = {
    query: `
      mutation {
        loginUser(input: { email: "${emailAdmin}", password: "123456" }) {
          token
        }
      }
    `,
  };
  const loginAdminRes = await request(app).post("/graphql").send(loginAdminQuery);
  tokenAdmin = loginAdminRes.body.data.loginUser.token;
});

afterAll(async () => {
  await UserModel.deleteOne({ email: "quoteuser@example.com" });
  await UserModel.deleteOne({ email: "adminquote@example.com" });
  await ProductModel.deleteOne({ _id: productId });
  await mongoose.disconnect();
});

describe("Quote GraphQL", () => {

  test("Create Quote", async () => {
    const createQuoteQuery = {
      query: `
        mutation {
          createQuote(input: {
            items: [
              { product: "${productId}", quantity: 2, price: 500 }
            ],
            total: 1000
          }) {
            id
            total
            status
            items {
              quantity
              price
            }
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send(createQuoteQuery)
      .expect(200);

    expect(res.body.data.createQuote.total).toBe(1000);
    expect(res.body.data.createQuote.status).toBe("pendiente");

    quoteId = res.body.data.createQuote.id;
  });

  test("Get Quotes", async () => {
    const quotesQuery = {
      query: `
        query {
          quotes {
            id
            total
            status
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send(quotesQuery)
      .expect(200);

    expect(res.body.data.quotes.length).toBeGreaterThan(0);
    expect(res.body.data.quotes[0]).toHaveProperty("status");
  });

  test("Get Quote by ID", async () => {
    const query = {
      query: `
        query {
          quote(id: "${quoteId}") {
            id
            total
            status
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send(query)
      .expect(200);

    expect(res.body.data.quote.id).toBe(quoteId);
    expect(res.body.data.quote.total).toBe(1000);
  });

    test("Update Quote Status (admin only)", async () => {
    const mutation = {
        query: `
        mutation {
            updateQuoteStatus(id: "${quoteId}", status: aprobada) {
            id
            status
            }
        }
        `,
    };

    const res = await request(app)
        .post("/graphql")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send(mutation)
        .expect(200);

    expect(res.body.data.updateQuoteStatus.status).toBe("aprobada");
    });

  test("Delete Quote (admin only)", async () => {
    const mutation = {
      query: `
        mutation {
          deleteQuote(id: "${quoteId}") {
            id
            total
            status
          }
        }
      `,
    };

    const res = await request(app)
      .post("/graphql")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(mutation)
      .expect(200);

    expect(res.body.data.deleteQuote.id).toBe(quoteId);
  });
});
