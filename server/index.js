require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const massive = require('massive');
const ac = require('./controllers/authController');
const tc = require('./controllers/tripsController');
const fc = require('./controllers/friendsController')
const app = express();

const { SESSION_SECRET, CONNECTION_STRING, SERVER_PORT } = process.env

app.use(bodyParser.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

massive(CONNECTION_STRING).then( db => {
    app.set('db', db)
    console.log('Database is connected')
});

// Authorization Endpoints
app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)
app.get('/auth/currentuser', ac.currentUser)

// Trips Endpoints
// app.get('/trip/discussion/:tripid', tc.getTripDiscussion)
app.get('/trip/discussion', tc.getTripDiscussion)
app.get('/trip/discussionauthor/:userid', tc.getDiscussionAuthor)

// Friends endpoints
app.get('/friends/get', fc.getFriends)
// app.get('/profile/:id', fc.getProfile)
app.post('/friends/add', fc.addFriends)
app.delete('/friends/delete/:id', fc.deleteFriends)
app.get('/friends/users', fc.getAllUsers)


app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
});
