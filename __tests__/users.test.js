const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { CookieAccessInfo } = require('cookiejar');

const { users, login } = require('./utils/auth-utils');

describe('/api/v1/users routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('#POST /api/v1/users should create a new user and log them in', async () => {
        // A user that doesn't exist yet
        const newUser = users.newUser;

        // POST to route to create new user
        const agent = request.agent(app);
        const response = await agent.post('/api/v1/users').send(newUser);
        expect(response.status).toEqual(200);

        // Should return user
        const user = response.body;
        expect(user).toEqual({
            id: expect.any(String),
            email: newUser.email
        });

        // Should create a session cookie
        const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
        expect(session).toBeTruthy();
    });

    it('#POST /api/v1/users should error if email already exists', async () => {
        // A user with the same email as an existing user
        const user = { ...users.alice, password: 'blah' };

        // Try to create user
        const response2 = await request(app).post('/api/v1/users').send(user);

        // Expect 409 response
        expect(response2.status).toEqual(409);
    });

    it('#GET /api/v1/users should return a list of users if logged in as an admin', async () => {
        // Log in as admin
        const agent = await login(users.admin);

        // Get a list of users
        const response = await agent.get('/api/v1/users');
        expect(response.status).toEqual(200);

        // Expect that list is well-formed
        const usersList = response.body;
        expect(usersList).toBeInstanceOf(Array);
        usersList.forEach(user => expect(user).toEqual({
            id: expect.any(String),
            email: expect.any(String)
        }));
    });

    it('#GET /api/v1/users should return 401 if not logged in as an admin user', async () => {
        // Log in as regular user
        const agent = await login(users.alice);

        const response = await agent.get('/api/v1/users');
        // Expect unauthorized
        expect(response.status).toEqual(401);
    });

    it('#POST /api/v1/users/sessions should log a user in', async () => {
        const agent = request.agent(app);

        // Log in as existing user
        const response = await agent.post('/api/v1/users/sessions').send(users.alice);
        expect(response.status).toEqual(200); // Expect success

        // Expect a session cookie to exist
        const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
        expect(session).toBeTruthy();
    });

    it('#POST /api/v1/users/sessions should error on bad credentials', async () => {
        const agent = request.agent(app);

        // Log in with wrong password
        const response = await agent.post('/api/v1/users/sessions').send({ ...users.alice, password: 'wrong' });
        expect(response.status).toEqual(401); // Expect 401

        // Expect no session
        const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
        expect(session).toBeUndefined();
    });

    it('#DELETE /api/v1/users/sessions should log a user out', async () => {
        // Log in as existing user
        const agent = await login(users.alice);

        // Log out
        await agent.delete('/api/v1/users/sessions');

        // Expect session cookie to be deleted
        const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
        expect(session).toBeUndefined();
    });

    afterAll(async () => {
        await setup(pool);
        pool.end();
    });
});
