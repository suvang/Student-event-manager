
const mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String
    },
    usn: {
        type: String
    },
    eventtype:{
        type: String
    },
     certificateImage:{
        type: Buffer,
       required: true
    },
    certificateType:{
        type: String,
       required: true
    }
   
});

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

employeeSchema.virtual('certificateImagePath').get(function() {
  if (this.certificateImage != null && this.certificateType != null) {
    return `data:${this.certificateType};charset=utf-8;base64,${this.certificateImage.toString('base64')}`
  }
})

mongoose.model('Employee', employeeSchema);