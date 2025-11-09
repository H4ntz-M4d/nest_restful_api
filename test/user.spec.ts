import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
  let app: INestApplication<App>;
  let logger: Logger
  let testService: TestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER)
    testService = app.get(TestService)
  });

  describe('POST /api/users', () => {

    beforeEach(async () => {
      await testService.deleteUsers();
    })

    it('should be rejected if request is invalid', async () => {
      const res = await request(app.getHttpServer()).post('/api/users').send({
        username: '',
        password: '',
        name: '',
      })

      logger.info(res.body)
      expect(res.status).toBe(400)
      expect(res.body.errors).toBeDefined()

    })

    it('should be able to register', async () => {
      const res = await request(app.getHttpServer()).post('/api/users').send({
        username: 'test',
        password: 'test',
        name: 'test',
      })

      logger.info(res.body)
      expect(res.status).toBe(200)
      expect(res.body.data.username).toBe('test')
      expect(res.body.data.name).toBe('test')

    })

    it('should be to rejected if username is already exist', async () => {
      await testService.createUser()

      const res = await request(app.getHttpServer()).post('/api/users').send({
        username: 'test',
        password: 'test',
        name: 'test',
      })

      logger.info(res.body)
      expect(res.status).toBe(400)
      expect(res.body.errors).toBeDefined

    })

  })

  describe('POST /api/users/login', () => {

    beforeEach(async () => {
      await testService.deleteUsers();
      await testService.createUser();
    })

    it('should be rejected if request is invalid', async () => {
      const res = await request(app.getHttpServer()).post('/api/users/login').send({
        username: '',
        password: '',
        name: '',
      })

      logger.info(res.body)
      expect(res.status).toBe(400)
      expect(res.body.errors).toBeDefined()

    })

    it('should be able to login', async () => {
      const res = await request(app.getHttpServer()).post('/api/users/login').send({
        username: 'test',
        password: 'test',
        name: 'test',
      })

      logger.info(res.body)
      expect(res.status).toBe(200)
      expect(res.body.data.username).toBe('test')
      expect(res.body.data.name).toBe('test')
      expect(res.body.data.token).toBeDefined()

    })

  })
});
