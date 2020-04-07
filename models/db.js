const mongoose = require('mongoose');

mongoose.connect('mongodb://heroku_vrdfzbr5:gqj3suuo5vq1i11clr8vgv7ai3@ds117846.mlab.com:17846/heroku_vrdfzbr5 ', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./user.model');
require('./employee.model');
require('./employeeculture.model');
