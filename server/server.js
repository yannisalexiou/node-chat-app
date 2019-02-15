const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

// console.log("OLD WAY: " + __dirname + '/../public');
// console.log("NEW WAY" + publicPath);

//We dont configure express by passing arguments
//We configure express by calling methods on app
var app = express();

//To configure our express static middleware
//This help ass to show on localhost our index.html page
app.use(express.static(publicPath));

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});