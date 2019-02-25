var moment = require('moment');

var date = moment();
date.add(1, 'years').subtract(9, 'months')
console.log('date: ', date.format('D MMM YYYY'));


var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var time = moment(createdAt);
console.log(time.format('h:mm a'));
