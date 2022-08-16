const request = require('supertest');
const app = require('../../lib/app');

const users = {
    newUser: {
        email: 'bob@test.com',
        password: 'qwerty'
    },
    alice: {
        id: '1',
        email: 'alice@test.com',
        password: '123456'
    },
    admin: {
        id: '2',
        email: 'admin@test.com',
        password: 'admin'
    },
    curmudgeon: {
        id: '3',
        email: 'curmudgeon@test.com',
        password: 'eeyore'
    }
};

async function login(user) {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(user);
    return agent;
}

module.exports = { users, login };
