const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');
const {
    isRealString
} = require('./utils/validation');
const {
    Users
} = require('./utils/users');
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

var users = new Users();

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

    //The above is for sending emit
    //emit is very similar to the event.
    //You "listen" for an event
    //You "Create" an emit

    //socket.emit from Admin text welcome to the chat app
    //socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //socket.broadcast.emit <- to send it to everyone except the user who join
    //from admin New user joined
    //socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'));

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room name are required.');
        }

        socket.join(params.room);
        // socket.leave('The office fans');
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //io.emit -> emits every single user
        //socket.broadcast.emit -> this sends the message everyone 
        //connected to the socket server except for the current user
        //socket.emit -> emits an event to specifically one user
        //For sending messages to specific room we will chain two above functions
        //io.emit -> io.to('The office fans').emit
        //socket.broadcast.emit -> socket.broadcast.to('The office fans').emit
        //socket.emit -> 'as mentioned above'

        //socket.emit from Admin text welcome to the chat app
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        //socket.broadcast.emit <- to send it to everyone except the user who join
        //from admin New user joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

        callback();
    });


    //This is for receiving emit
    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            //This emit an event in every single connection
            io.to(user.room).emit('newMessage', generateMessage(
                user.name,
                message.text));
        }
        console.log('createMessage', message);

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
        
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});