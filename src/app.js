const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//enable sending json to the server
app.use(bodyParser.json());

//enable sending url-encoded formdata to the server
app.use(express.urlencoded({ extended: true }));

//set view engine and path
app.set('views', __dirname);
app.set('view engine', 'ejs');

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

//path variables
app.get('/users/:id', (req, res) => {
    //query paramters could be added to specify the data that has to looked up
    /*
    if(req.query.characters){
        const username = users[req.params.id].name;
        const numOfChars = req.query.characters;
        const result = username.slice(0, numOfChars);
        res.json(result)
    }
    */ 
    const user = users[req.params.id];
    if(user) {
        res.json(user.name);
    } else {
        res.status(404).end()
    }
})

//rendering is just the process of taking data and putting it into a string
//render a string: pass the query string as a string
app.get('/render', (req, res) => {
    if(req.query.foo){
        res.end(`foo: ${req.query.foo}`)
    } else {
        res.status(400).end();
    }
})
/*
- html rendering is passing a specially tag-formatted string that the browser
can convert into a page
- here we render html.ejs and pass the object foo with query string as 
property.
*/
app.get('/html', (req, res) => {
    res.render('./index.ejs', { foo: req.query.foo })
})

//middleware
const myMiddleware = (req, res, next) => {
    const foo = req.query.foo;
    if(!foo) return next();
    return res.json({ foo: parseInt(foo) + 1});
}
/*
note that the middleware returns, the json below will not run if 
middleware has returned
*/
app.get('/middle', myMiddleware, (req, res) => {
    res.json({ foo: 1 });
})

/*
middleware delete protection: requires token + admin account
*/
const hasToken = (req, res, next) => {
    if(!req.query.token) return res.json({ message: 'You need a token'})
    return next();
}
const isAdmin = (req, res , next) => {
    const isAdmin = req.get('X-admin');
    if(!isAdmin) return res.json({ message: 'You need to be an admin'})
    return next();
}
app.delete('/users/:id', hasToken, isAdmin, (req, res) => {
    res.json({ message: 'Your data was removed' });
})
module.exports = app;