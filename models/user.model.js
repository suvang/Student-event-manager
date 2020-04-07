var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type: String, unique: true,  required: 'This field is required.'},
	password: {type: String, required: 'This field is required.'}
	
});

mongoose.model('User',userSchema);
