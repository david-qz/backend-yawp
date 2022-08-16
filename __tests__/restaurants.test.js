const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
// const { CookieAccessInfo } = require('cookiejar');
//
// const { users, login } = require('./utils/auth-utils');

describe('/api/v1/restaurants routes', () => {
    beforeEach(() => {
        return setup(pool);
    });

    it('#GET /api/v1/restaurants should return a list of restaurants', async () => {
        const response = await request(app).get('/api/v1/restaurants');
        expect(response.status).toEqual(200);

        const restaurantList = response.body;
        expect(restaurantList).toBeInstanceOf(Array);
        restaurantList.forEach(restaurant => expect(restaurant).toEqual({
            id: expect.any(String),
            name: expect.any(String),
            cuisine: expect.any(String),
            cost: expect.any(Number),
            website: expect.any(String),
            image: expect.any(String)
        }));
    });

    afterAll(async () => {
        await setup(pool);
        pool.end();
    });
});
