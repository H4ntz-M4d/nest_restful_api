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

    // ====================================================== REGISTER USER =============================================================

    describe('POST /api/contact', () => {

        beforeEach(async () => {
            await testService.deleteContact();
        })

        it('should be rejected if request is invalid', async () => {
            const res = await request(app.getHttpServer()).post('/api/contact').send({
                first_name: '',
                last_name: '',
                email: 'salah',
                phone: ''
            }).set('Authorization', '51616374-7017-45de-9de8-fe8a4768b89e')

            logger.info(res.body)
            expect(res.status).toBe(400)
            expect(res.body.errors).toBeDefined()

        })

        it('should be able to create contact', async () => {
            const res = await request(app.getHttpServer()).post('/api/contact').send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@gmail.com',
                phone: '0845678901'
            }).set('Authorization', '51616374-7017-45de-9de8-fe8a4768b89e')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.first_name).toBe('test')
            expect(res.body.data.last_name).toBe('test')
            expect(res.body.data.email).toBe('test@gmail.com')
            expect(res.body.data.phone).toBe('0845678901')

        })

    })
});
