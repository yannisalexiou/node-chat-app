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
    // socket.emit('createMessage', {
    //     from: 'andrew',
    //     text: 'Yep, that works for me.'
    // });
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    console.log("newMessage: ", message);
    //We create a list and we added and the end of the ol
    //list in indext.html
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: 'Frank',
//     text: 'Hi'
// }, function(data) {
//     console.log('Got it: ', data);
// });

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(data) {
        // console.log(data);
    })
});