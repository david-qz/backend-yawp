const request = require('supertest');
const app = require('../../lib/app');

const users = {
    newUser: {
        email: 'bob@test.com',
        password: 'qwerty'
    },
    existingUser: {
        id: '1',
        email: 'alice@test.com',
        password: '123456'
    },
    adminUser: {
        id: '2',
        email: 'admin@test.com',
        password: 'admin'
    }
};

async function login(user) {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(user);
    return agent;
}

module.exports = { users, login };
