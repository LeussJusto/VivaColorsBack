import request from 'supertest';
import { createApp } from '../app';
import type { Express } from 'express';
import { UserModel } from '../infrastructure/db/mongo/models/UserModel';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

let app: Express;

beforeAll(async () => {
  app = (await createApp()).app;

  // Conectar DB de prueba si quieres
  // await mongoose.connect(process.env.MONGO_URI_TEST!);

  // Crear usuario de prueba si no existe
  const existingUser = await UserModel.findOne({ email: "yo@example.com" });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await UserModel.create({
      name: "Test User",
      email: "yo@example.com",
      password: hashedPassword,
      role: "admin"
    });
  }
});

afterAll(async () => {
  // Eliminar solo el usuario de test
  await UserModel.deleteOne({ email: "yo@example.com" });

  await mongoose.disconnect();
});

describe('Auth GraphQL', () => {
  let token: string;

  test('LoginUser', async () => {
    const query = {
      query: `
        mutation {
          loginUser(input: { email: "yo@example.com", password: "123456" }) {
            token
            user { email role }
          }
        }
      `
    };

    const res = await request(app)
      .post('/graphql')
      .send(query)
      .expect(200);

    expect(res.body.data.loginUser.user.email).toBe("yo@example.com");
  expect(res.body.data.loginUser.user.role).toBe("admin");

    token = res.body.data.loginUser.token;
  });

  test('Me', async () => {
    const query = {
      query: `
        query {
          me {
            email
            role
          }
        }
      `
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(query)
      .expect(200);

  expect(res.body.data.me.email).toBe("yo@example.com");
  });

  test('Users (admin only)', async () => {
    const query = {
      query: `
        query {
          users {
            email
            role
          }
        }
      `
    };

    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send(query)
      .expect(200);

    expect(res.body.data.users.map((u: any) => u.email)).toContain("yo@example.com");
  });
});
