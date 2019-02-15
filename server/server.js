const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// console.log("OLD WAY: " + __dirname + '/../public');
// console.log("NEW WAY" + publicPath);

//We dont configure express by passing arguments
//We configure express by calling methods on app
var app = express();
//When we call app.listen method we actually call the below same method
var server = http.createServer(app);
//We get back our web socket.
//On here we can do everything we want as emmiting or listening on events
//This is how we communicate between server and client
var io = socketIO(server);
//After creating the above var we are ready to receive connections
//So we need to build one from the client

//To configure our express static middleware
//This help ass to show on localhost our index.html page
app.use(express.static(publicPath));

//let us register an event listener
//we can listen for a specific event
//And do something when the event happens
//This let us listen for a new connection (client -> server)
//The socket argument is very similar to the socket argument
//from client (html file)
//This represents the individual socket to seperate from other (clients)
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});