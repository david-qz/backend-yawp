const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { CookieAccessInfo } = require('cookiejar');

describe('/api/v1/users routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('#POST /api/v1/users should create a new user and log them in', async () => {
        const agent = request.agent(app);

        const response = await agent.post('/api/v1/users').send({ email: 'alice@test.com', password: '123456' });
        expect(response.status).toEqual(200);

        const user = response.body;
        expect(user).toEqual({
            id: expect.any(String),
            email: 'alice@test.com'
        });

        const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
        expect(session).toBeTruthy();
    });

    it('#POST /api/v1/users should error if email already exists', async () => {
        const response1 = await request(app).post('/api/v1/users').send({ email: 'alice@test.com', password: '123456' });
        expect(response1.status).toEqual(200);

        const response2 = await request(app).post('/api/v1/users').send({ email: 'alice@test.com', password: 'qwerty' });
        expect(response2.status).toEqual(409);
    });

    it('#POST /api/v1/users/sessions should log a user in', async () => {
        const agent = request.agent(app);
        // Make a user
        await agent.post('/api/v1/users').send({ email: 'alice@test.com', password: '123456' });
        // Log out
        await agent.delete('/api/v1/users/sessions');

        // Log back in
        const response = await agent.post('/api/v1/users/sessions').send({ email: 'alice@test.com', password: '123456' });
        expect(response.status).toEqual(200);

        const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
        expect(session).toBeTruthy();
    });

    it('#POST /api/v1/users/sessions should error on bad credentials', async () => {
        const agent = request.agent(app);
        // Make a user
        await agent.post('/api/v1/users').send({ email: 'alice@test.com', password: '123456' });
        // Log out
        await agent.delete('/api/v1/users/sessions');

        // Log back in
        const response = await agent.post('/api/v1/users/sessions').send({ email: 'alice@test.com', password: 'qwerty' });
        expect(response.status).toEqual(401);
    });

    it('#DELETE /api/v1/users/sessions should log a user out', async () => {
        const agent = request.agent(app);

        // Log in
        await agent.post('/api/v1/users').send({ email: 'alice@test.com', password: '123456' });

        // Log out
        await agent.delete('/api/v1/users/sessions');

        const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
        expect(session).toBeUndefined();
    });

    afterAll(async () => {
        await setup(pool);
        pool.end();
    });
});
