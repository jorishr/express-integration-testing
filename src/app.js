const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//enable sending json to the server
app.use(bodyParser.json());
//enable sending url-encoded formdata to the server
app.use(express.urlencoded({ extended: true }));

//routes
app.get('/', (req, res) => {
    res.json({ foo: 1 });
})
app.put('/', (req, res) => {
    const input =  req.body.foo;
    const output = parseInt(input) + 1;
    res.json({ foo: output });
})
app.post('/', (req, res) => {
    const foo = req.body.foo;
    res.status(201).json({ foo: foo });
})
app.delete('/', (req, res) => {
    const foo = 0;
    res.status(202).json({ foo: foo });
})

//error page
app.get('/error', (req, res) => {
    res.status(500).end();
})

//wrong method used (everything but GET)
app.all('/error', (req, res) => {
    res.status(405).end();
})

//auth protected pages, send 401 or 403
app.get('/auth', (req, res) => {
    res.status(401).end();
    //res.status(403).end();
})

//bad request (wrong username or password)
app.get('/failed-login', (req, res) => {
    res.status(400).end();
})

//user redirect
app.get('/redirect', (req, res) => {
    res.status(302).redirect('/');
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(username === 'foo' && password === 'bar'){
        res.status(200).end();
    }
    res.status(400).end();
})

app.get('/query', (req, res) => {
    const { firstParam, secondParam } = req.query;
    if(firstParam === 'foo' && secondParam === 'bar'){
        res.status(200).end();
    }
    res.status(400).end();
})

//pagination with query parameters
const users = {
    john: {
        name: 'john'
    },
    jane: {
        name: 'jane'
    },
    bob: {
        name: 'bob'
    }
}

app.get('/users', (req, res) => {
    //query values are strings, thus convert to integer
    const limitInt = parseInt(req.query.limit);
    const offsetInt = parseInt(req.query.offset);
    //no limit, send all users
    const length = limitInt > 0 ? limitInt : users.length;
    const offset = offsetInt > 0 ? offsetInt : 0;
    //result should be array
    const result = Object.values(users)
        .slice(offset)      //only keep from offset index to the end
        .slice(0, length);  //apply limit
    res.json(result);
})

module.exports = app;