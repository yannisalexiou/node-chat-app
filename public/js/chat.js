//This script needs to run just after socket.io
//io method is available from above script
//This create a connection and stores the socket in a variable
//This var is critical for comminicating
//We need it in order to listen the data from the server
//and in order to send data back to him
var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

//This let us listen on an event
socket.on('connect', function() {
    console.log('Connected to server');

    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });

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

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html= Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]')

    socket.emit('createMessage', {
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
