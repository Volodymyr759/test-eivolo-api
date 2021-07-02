import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app/app.module';
import { disconnect } from 'mongoose';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { PrefferedCommunicationWay } from '../src/messages/prefCommunicationWayEnum';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'waddia2@gmail.com',
  password: 'waddia',
};

const testMessage: CreateMessageDto = {
  fullName: 'Test full name',
  company: 'Test company',
  prefCommunication: PrefferedCommunicationWay.Email,
  email: 'test@site.com',
  phoneNumber: 'test123456',
  messageText: 'Test message',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    token = body.access_token;
  });

  it('/messages (POST)', async () => {
    return request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', 'Bearer ' + token)
      .send(testMessage)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/messages/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/messages/')
      .set('Authorization', 'Bearer ' + token)
      .send(testMessage)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBeGreaterThan(0);
      });
  });

  it('/messages/:id (GET)', async () => {
    return request(app.getHttpServer())
      .get('/messages/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .send(testMessage)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body._id).toBeDefined();
      });
  });

  it('/messages/:id (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/messages/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body._id).toBe(createdId);
      });
  });

  afterAll(() => {
    disconnect();
  });
});
