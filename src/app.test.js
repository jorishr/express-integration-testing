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
        const response = 
            await request(app)
                .put('/')
                .set('Content-Type', 'application/json')
                .expect(200)
                .send({ foo : 1 });
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
        const response = 
            await request(app)
                .post('/')
                .set('Content-Type', 'application/json')
                .expect(201)
                .send({ foo : 1 });
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
        await request(app).get('/failed-login').expect(400);
    })
})

describe('Redirect', () => {
    it('Returns status code 302', async () => {
        await request(app).get('/redirect').expect(302);
    })
})

describe('Send form login data', () => {
    it('Returns status code 200 for correct credentials', async () => {
        await request(app)
            .post('/login')
            .set('Content-Type','application/x-www-form-urlencoded')
            .expect(200)
            .send({ username: 'foo', password: 'bar'})
        })
        it('Returns status code 400 for incorrect credentials', async () => {
        await request(app)
        .post('/login')
        .set('Content-Type','application/x-www-form-urlencoded')
        .expect(400)
            .send({ username: 'foos', password: 'bar'})
        })
        it('Returns status code 400 for incorrect credentials', async () => {
        await request(app)
        .post('/login')
            .set('Content-Type','application/x-www-form-urlencoded')
            .expect(400)
            .send({ username: 'foo', password: 'bars'})
    })
})

describe('Query parameter tests', () => {
    it('Returns status code 200 if params are valid', async () => {
        await request(app)
            .get('/query/?firstParam=foo&secondParam=bar')
            .expect(200);
    })
    it('Returns status code 400 if params are invalid', async () => {
        await request(app)
            .get('/query/?firstParam=oo&secondParam=bar')
            .expect(400);
    })
    it('Returns status code 400 if params are invalid', async () => {
        await request(app)
            .get('/query/?firstParam=foo&secondParam=ar')
            .expect(400);
    })
})
describe('Pagination tests', () => {
    it('Returns a list of users with correct length', async () => {
        const response = await request(app)
            .get('/users/?limit=2&offset=1')
            .expect(200);
        const body = response.body;
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(2);
        expect(body[0].name).toEqual('jane');
    })
    it('Returns a list of users with correct length', async () => {
        const response = await request(app)
            .get('/users/?limit=0&offset=0')
            .expect(200);
        const body = response.body;
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(3);
        expect(body[0].name).toEqual('john');
        expect(body[1].name).toEqual('jane');
        expect(body[2].name).toEqual('bob');
    })
})

describe('Route parameter tests', () => {
    it('Returns the correct name corresponding with the route parameter id', async () => {
        const response = await request(app).get('/users/bob').expect(200);
        const body = response.body;
        expect(body).toEqual('bob');
    })
    it('Returns the correct name corresponding with the route parameter id', async () => {
        const response = await request(app).get('/users/john').expect(200);
        const body = response.body;
        expect(body).toEqual('john');
    })
    it('Returns status code 404 for invalid route parameter', async () => {
        await request(app).get('/users/jack').expect(404);
    })
})
