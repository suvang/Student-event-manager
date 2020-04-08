const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Employee = mongoose.model('Employee');
const User = mongoose.model('User');
const Employeeculture = mongoose.model('Employeeculture');
var url = process.env.MONGODB_URI || 'mongodb://localhost:27017/EmployeeDB';



//incase loggedIn
const redirectHomelogin = (req, res, next) => {
    if(req.session.User){
        res.redirect('/employee/homelogin');
    }else {
        next()
    }
}

router.get('/',redirectHomelogin,(req,res) => {
    res.render("employee/home", {
        viewTitle1: "Welcome to Event Manager",
        viewTitle: "CHOOSE EVENT"
    });
});


//login
router.get('/login', redirectHomelogin, (req, res) => {
   res.render("employee/login")
});

router.get('/login', redirectHomelogin, (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/login", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
       
    });
});


// technicallogin page
router.get('/',redirectHomelogin, (req, res) => {
    res.render("employee/technicalhome", {
        viewTitle: "Insert Employee"
    });
});

router.get('/technicalhome',redirectHomelogin, (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/technicalhome", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

// culturallogin page
router.get('/',redirectHomelogin, (req, res) => {
    res.render("employee/culturalhome", {
        viewTitle: "Insert Employee"
    });
});

router.get('/culturalhome',redirectHomelogin, (req, res) => {
    Employeeculture.find((err, docs) => {
        if (!err) {
            res.render("employee/culturalhome", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

//incase not loggedIn
const redirectLogin = (req, res, next) => {
    if(!req.session.User){
        res.redirect('/employee/login');
    }else {
        next()
    }
}

// cultural view all page 

router.get('/',redirectLogin, (req, res) => {
    res.render("employee/list1", {
        viewTitle: "Insert Employee"
    });
});

router.get('/list1',redirectLogin, (req, res) => {
    Employeeculture.find((err, docs) => {
        if (!err) {
            res.render("employee/list1", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

//technicall view all page

router.get('/',redirectLogin, (req, res) => {
    res.render("employee/list", {
        viewTitle: "Insert Employee"
    });
});

router.get('/list',redirectLogin, (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});

//addOrEdit page
router.get('/addOrEdit',redirectLogin, (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Technical Event - Student Details"
    });
});

router.get('/addOrEdit',redirectLogin, (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("employee/homelogin", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
}); 

//addOrEdit1 page
router.get('/addOrEdit1',redirectLogin, (req, res) => {
    res.render("employee/addOrEdit1", {
        viewTitle: "Cultural Event - Student Details"
    });
});

router.get('/addOrEdit1',redirectLogin, (req, res) => {
    User.find((err, docs) => {
        if (!err) {
            res.render("employee/homelogin", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
}); 



//login
router.get('/homelogin',redirectLogin, (req, res) => {
    User.find((err, docs) => {
      
       if (!err) {
            res.render("employee/homelogin", {
                list: docs,
                viewTitle:'CHOOSE AN EVENT',
                viewTitle1: 'WELCOME TO ADMIN PANEL'
            });
        }
        else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
}); 

router.post('/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username, password: password}, function(err,User){
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        if(!User) {
            return res.status(404).send();
        }
        // req.session.User = User;
          if(!req.session.User){
          req.session.User = User;
    }
   if(req.session.User){
     console.log(req.session.User);
 }
      return res.redirect('/employee/homelogin');
       
      
    })
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

//post,redirecting to list1

router.post('/', (req, res) => {
    if (req.body._id == '' && req.body.eventtype=="Cultural")
        insertRecord1(req, res);
        else
        updateRecord1(req, res);

       if (req.body._id == '' && req.body.eventtype=="Technical" )
        insertRecord(req, res);
        else
        updateRecord(req, res);
}); 



 function insertRecord(req, res) {
    var employee = new Employee();
    employee.cover = req.body.cover;
     const cover = JSON.parse(req.body.cover);
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.usn = req.body.usn;
    employee.eventtype = req.body.eventtype;
   employee.certificateImage = new Buffer.from(cover.data,'base64');
   employee.certificateType = cover.type;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Students",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update students',
                    employeeculture: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}  


 
 function insertRecord1(req, res) {
    var employeeculture = new Employeeculture();
     employeeculture.cover = req.body.cover;
     const cover = JSON.parse(req.body.cover);
    employeeculture.cover = req.body.cover;
    employeeculture.fullName = req.body.fullName;
    employeeculture.email = req.body.email;
    employeeculture.usn = req.body.usn;
    employeeculture.eventtype = req.body.eventtype;
  employeeculture.certificateImage = new Buffer.from(cover.data,'base64');
    employeeculture.certificateType = cover.type;
    employeeculture.save((err, doc) => {
        if (!err)
            res.redirect('employee/list1');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit1", {
                    viewTitle: "Insert Students",
                    employeeculture: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord1(req, res) {
    Employeeculture.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee/list1'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit1", {
                    viewTitle: 'Update students',
                    employeeculture: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    }); 
} 


router.get('/logout/:id',redirectLogin, function(req,res)  {
    User.findById(req.params.id, (err,docs) => {
        if (!err) {
            req.session.destroy();
                console.log('session destroyed');
            res.redirect('/employee');
        }
        else { console.log('Error in student logout :' + err); }
    });
    //return res.redirect('/employee/login');
});

 router.get('/delete1/:id', (req, res) => {
    Employeeculture.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list1');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});  


 router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});  


 //view list1
router.get('/:id', (req, res) => {
    Employeeculture.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit1", {
                viewTitle: "Update Employee",
                employeeculture: doc
            });
        }
    });
});

//view list
router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
    });
});


module.exports = router;