const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const loginSchema = new mongoose.Schema({
    usrn: {
        type: String, 
        required: [true, 'Enter a valid email.'],
        unique: true,
        lowercase: true,
        validate: [ isEmail, 'Please enter a valid email.']
        },
    hash: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [8, 'Minimum password length is 8 characters.']
        },
    yous: { 
        type: String,
        required: true
        },
}, { timestamps: true });



// fire post fucntion
loginSchema.post('save', function (doc, next){
    console.log('New login was created:', doc);
    next();
});

//fire pre function
loginSchema.pre('save', async function (next){
    console.log('About to create new user.');
    const salt = await bcrypt.genSalt();
    this.hash = await bcrypt.hash(this.hash, salt);
    console.log('Hashed password.');
    next();
});

loginSchema.statics.login = async function(usrn, hash){
    const personLogging = await this.findOne({usrn});
    console.log(hash);
    //console.log(personLogging.hash);
    if(personLogging){
        console.log('comparing hashes');
        const scale = await bcrypt.compare(hash, personLogging.hash);
        console.log(scale);
        if(scale){
            console.log('they matched');
            return personLogging;
        }
        console.log('throwing hash exception');
        throw Error('incorrect password');
    }
    console.log('throwing user excpetion');
    throw Error('incorrect email');
}
const Login = mongoose.model('Login', loginSchema);//database collection is called Logins
module.exports = Login;