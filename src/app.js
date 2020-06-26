const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//enable sending json to the server
app.use(bodyParser.json());

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
app.get('/login', (req, res) => {
    res.status(400).end();
})
//user redirect
app.get('/redirect', (req, res) => {
    res.status(302).redirect('/');
})
module.exports = app;