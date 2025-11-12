import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController', () => {
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

    // ====================================================== CREATE CONTACT =============================================================

    describe('POST /api/contact', () => {

        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUsers();

            await testService.createUser();
        })

        it('should be rejected if request is invalid', async () => {
            const res = await request(app.getHttpServer()).post('/api/contact').send({
                first_name: '',
                last_name: '',
                email: 'salah',
                phone: ''
            }).set('Authorization', 'test')

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
            }).set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.first_name).toBe('test')
            expect(res.body.data.last_name).toBe('test')
            expect(res.body.data.email).toBe('test@gmail.com')
            expect(res.body.data.phone).toBe('0845678901')

        })

    })

    // ====================================================== GET CONTACT =============================================================

    describe('GET /api/contact/:id', () => {

        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUsers();

            await testService.createUser();
            await testService.createContact();
        })

        it('should be rejected if contact is not found', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact/2`)
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(404)
            expect(res.body.errors).toBeDefined()

        })

        it('should be able to create contact', async () => {
            const contact = await testService.getContact()
            const res = await request(app.getHttpServer())
                .get(`/api/contact/${contact?.id}`)
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.first_name).toBe('test')
            expect(res.body.data.last_name).toBe('test')
            expect(res.body.data.email).toBe('test@gmail.com')
            expect(res.body.data.phone).toBe('0845678901')

        })

    })

    // ====================================================== UPDATE CONTACT =============================================================

    describe('PUT /api/contact', () => {

        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUsers();

            await testService.createUser();
            await testService.createContact();
        })

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact()
            const res = await request(app.getHttpServer()).put(`/api/contact/${contact?.id}`).send({
                first_name: '',
                last_name: '',
                email: 'salah',
                phone: ''
            }).set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(400)
            expect(res.body.errors).toBeDefined()

        })

        it('should be rejected if contact is not found', async () => {
            const contact = await testService.getContact()
            const res = await request(app.getHttpServer()).put(`/api/contact/2`).send({
                first_name: 'test updated',
                last_name: 'test updated',
                email: 'testupdated@gmail.com',
                phone: '99999999'
            }).set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(404)
            expect(res.body.errors).toBeDefined()

        })

        it('should be able to update contact', async () => {
            const contact = await testService.getContact()
            const res = await request(app.getHttpServer()).put(`/api/contact/${contact?.id}`).send({
                first_name: 'test updated',
                last_name: 'test updated',
                email: 'testupdated@gmail.com',
                phone: '999999999'
            }).set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.first_name).toBe('test updated')
            expect(res.body.data.last_name).toBe('test updated')
            expect(res.body.data.email).toBe('testupdated@gmail.com')
            expect(res.body.data.phone).toBe('999999999')

        })

    })

    // ====================================================== DELETE CONTACT =============================================================

    describe('DELETE /api/contact/:id', () => {

        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUsers();

            await testService.createUser();
            await testService.createContact();
        })

        it('should be rejected if contact is not found', async () => {
            const res = await request(app.getHttpServer())
                .delete(`/api/contact/2`)
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(404)
            expect(res.body.errors).toBeDefined()

        })

        it('should be able to romove contact', async () => {
            const contact = await testService.getContact()
            const res = await request(app.getHttpServer())
                .delete(`/api/contact/${contact?.id}`)
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data).toBe(true)

        })

    })

    // ====================================================== SEARCH CONTACT =============================================================

    describe('SEARCH /api/contact/:id', () => {

        beforeEach(async () => {
            await testService.deleteContact();
            await testService.deleteUsers();

            await testService.createUser();
            await testService.createContact();
        })

        it('should be able to search contact', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(1)

        })

        it('should be able to search contact by name', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .query({
                    name: 'tes'
                })
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(1)

        })

        it('should be able to search contact by name not found', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .query({
                    name: 'wrong'
                })
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(0)

        })

        it('should be able to search contact by email', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .query({
                    email: 'tes'
                })
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(1)

        })

        it('should be able to search contact by email not found', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .query({
                    email: 'wrong'
                })
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(0)

        })

        it('should be able to search contact by phone', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .query({
                    phone: '901'
                })
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(1)

        })

        it('should be able to search contact by phone not found', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .query({
                    phone: '888'
                })
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(0)

        })

        it('should be able to search contact wwith page', async () => {
            const res = await request(app.getHttpServer())
                .get(`/api/contact`)
                .query({
                    size: 1,
                    page: 2,
                })
                .set('Authorization', 'test')

            logger.info(res.body)
            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(0)
            expect(res.body.paginate.currentPage).toBe(2)
            expect(res.body.paginate.size).toBe(1)
            expect(res.body.paginate.totalPage).toBe(1)

        })
    })
});
