const app = require('./app');
const request = require('supertest');
describe('Error handling', () => {
    it('Returns 404 for invalid route', async () => {
        await request(app).get('/failure').expect(404)
    })
    it('Returns statuscode 405 for invalid method', async () => {
        await request(app).post('/error').expect(405);
    })
    it('Returns statuscode 500', async () => {
        await request(app).get('/error').expect(500);
    })
})

describe('Get JSON', () => {
    it('Can GET /', async () => {
        await request(app).get('/').expect(200);
    })
    it('Should return one foo', async () => {
        const response = await request(app).get('/').expect(200);
        const expected = { foo: 1 };
        const actual = response.body;
        expect(actual).toEqual(expected);
    })
})
describe('Update JSON', () => {
    it('Can Put /', async () => {
        await request(app).put('/').expect(200);
    })
    it('Should return two foo', async () => {
        const response = await request(app).put('/').expect(200).send({ foo : 1 });
        const expected = { foo: 2 };
        const actual = response.body;
        expect(actual).toEqual(expected);
    })
})
describe('Post JSON', () => {
    it('Can Post /', async () => {
        await request(app).post('/').expect(201);
    })
    it('Should return one foo', async () => {
        const response = await request(app).post('/').expect(201).send({ foo : 1 });
        const expected = { foo: 1 };
        const actual = response.body;
        expect(actual).toEqual(expected);
    })
})
describe('Delete JSON', () => {
    it('Can Delete /', async () => {
        await request(app).delete('/').expect(202);
    })
    it('Should return zero foo', async () => {
        const response = await request(app).delete('/').expect(202);
        const expected = { foo: 0 };
        const actual = response.body;
        expect(actual).toEqual(expected);
    })
})
describe('Authorized access', () => {
    it('Unauthorized request returns status code 401', async () => {
        await request(app).get('/auth').expect(401);
    })
    it('Bad user request returns status code 400', async () => {
        await request(app).get('/login').expect(400);
    })
})
describe('Redirect', () => {
    it('Returns status code 302', async () => {
        await request(app).get('/redirect').expect(302);
    })
})