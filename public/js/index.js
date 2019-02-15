//This script needs to run just after socket.io
//io method is available from above script
//This create a connection and stores the socket in a variable
//This var is critical for comminicating
//We need it in order to listen the data from the server
//and in order to send data back to him
var socket = io();

//This let us listen on an event
socket.on('connect', function() {
    console.log('Connected to server');

    //We call the emit inside connect
    //To be sure that we only emit if we establish connection
    socket.emit('createEmail', {
        to: 'jen@example.com',
        text: 'hey. This is Andrew',
    });

    socket.emit('createMessage', {
        from: 'andrew',
        text: 'Yep, that works for me.'
    });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newEmail', function(email) {
    console.log('New email', email);
});

socket.on('newMessage', function (message) {
    console.log("newMessage: ", message);
});