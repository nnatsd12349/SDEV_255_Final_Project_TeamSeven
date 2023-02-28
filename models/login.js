const mongoose = require('mongoose');
const Schema= mongoose.Schema;


const loginSchema = new Schema({
    usrn: { type: String, required: true},
    hash: { type: String, required: true},
    auth: { type: String, required: true}

}, { timestamps: true });

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;