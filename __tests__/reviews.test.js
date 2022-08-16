const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { CookieAccessInfo } = require('cookiejar');

const { users, login } = require('./utils/auth-utils');

describe('/api/v1/reviews routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('#DELETE /api/v1/reviews/:id should let a user delete their reviews', async () => {
        // Log in as 'alice'
        const agent = await login(users.alice);

        // Alice made review 1
        const response = await agent.delete('/api/v1/reviews/1');
        expect(response.status).toEqual(200);

        const review = response.body;
        expect(review).toEqual({
            id: '1',
            userId: '1',
            restaurantId: '2',
            detail: 'Great samosas!',
            stars: 4
        });
    });

    it('#DELETE /api/v1/reviews/:id is protected but allows admins to override', async () => {
        // Log in as 'curmudgeon'
        let agent = await login(users.curmudgeon);
        // Try to delete alice's review
        let response = await agent.delete('/api/v1/reviews/1');
        expect(response.status).toEqual(401); // Expect unauthorized

        // Log in as admin
        agent = await login(users.admin);
        // Try to delete alice's review
        response = await agent.delete('/api/v1/reviews/1');
        expect(response.status).toEqual(200);
    });

    afterAll(async () => {
        await setup(pool);
        pool.end();
    });
});
