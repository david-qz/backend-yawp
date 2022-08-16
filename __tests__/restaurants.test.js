const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
//const { CookieAccessInfo } = require('cookiejar');

const { users, login } = require('./utils/auth-utils');

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

    it('#GET /api/v1/restaurants/:id should return restaurant with id and nested reviews', async () => {
        const response = await request(app).get('/api/v1/restaurants/1');
        expect(response.status).toEqual(200);

        const restaurant = response.body;
        expect(restaurant).toEqual({
            id: expect.any(String),
            name: expect.any(String),
            cuisine: expect.any(String),
            cost: expect.any(Number),
            website: expect.any(String),
            image: expect.any(String),
            reviews: expect.any(Array)
        });
        restaurant.reviews.forEach(review => expect(review).toEqual({
            id: expect.any(Number),
            restaurantId: expect.any(Number),
            userId: expect.any(Number),
            detail: expect.any(String),
            stars: expect.any(Number)
        }));
    });

    it('#POST /api/v1/restaurants/:id/reviews should create a new review for the logged in user', async () => {
        const user = users.existingUser;
        const newReview = { detail: 'I like it!', stars: 5 };

        const agent = await login(user);

        const response = await agent.post('/api/v1/restaurants/1/reviews').send(newReview);
        expect(response.status).toEqual(200);

        const review = response.body;
        expect(review).toEqual({
            id: expect.any(String),
            restaurantId: '1',
            userId: user.id,
            detail: newReview.detail,
            stars: newReview.stars
        });
    });

    it('#POST /api/v1/restaurants/:id/reviews is protected', async () => {
        const response = await request(app).post('/api/v1/restaurants/1/reviews').send({ detail: 'I like it!', stars: 5 });
        expect(response.status).toEqual(401);
    });

    afterAll(async () => {
        await setup(pool);
        pool.end();
    });
});
