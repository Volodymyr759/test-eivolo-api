import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { disconnect } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

const today = new Date();
const milliseconds = today.getMilliseconds();

const testUser: CreateUserDto = {
  login: 'userfortesting' + milliseconds + '@site.com',
  password: 'test123456',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userEmail: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .then(({ body }: request.Response) => {
        userEmail = body.email;
        expect(userEmail).toBeDefined();
      });
  });

  it('/auth/:email (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/auth/' + userEmail)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
