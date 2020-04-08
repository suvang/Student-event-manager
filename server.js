var PORT = process.env.PORT || 3000;
require('./models/db');
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser= require('body-parser');
var session = require('express-session');


const employeeController = require('./controllers/employeeController');

var app = express();

app.use(express.static(__dirname + '/views/employee'));

app.use(bodyParser.urlencoded({
	limit: '50mb',extended: true
}));
app.use(bodyParser.json());
app.use('/javascripts', express.static(__dirname + '/public/javascripts'));
app.set('views', path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutDir: __dirname + '/views/layouts/'}));
app.set('view engine', 'hbs');
app.use(session({secret:"hebfhebf",resave:false,saveUninitialized:true}));

app.listen(PORT, () => {
	console.log('express server started at port:' + PORT);
}); 


app.use('/employee', employeeController);