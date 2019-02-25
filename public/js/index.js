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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from}, ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>')
    li.text(`${message.from}, ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);

    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]')

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function(data) {
        messageTextbox.val('')
        // console.log(data);
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by our browser.');
    } else {
        locationButton.attr('disabled', 'disabled').text('Sending Location');

        navigator.geolocation.getCurrentPosition(function (position) {
            locationButton.removeAttr('disabled').text('Send Location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function () {
            locationButton.removeAttr('disabled').text('Send Location');
            alert('Unable to fetch location.');
        });
    }
});
