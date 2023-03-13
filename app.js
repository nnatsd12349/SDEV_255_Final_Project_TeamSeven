const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {requireAuth, checkLogin} = require('./middleware/authMiddleware');



const FPRoutes= require('./routes/FPRoutes')
//to write to SDEV255DB db, add "SDEV255DB" into the uri as shown here:
//const DBURI ='mongodb+srv://stides:Seventy7@sdev255.syrfobv.mongodb.net/SDEV255DB?retryWrites=true&w=majority'
//to write to test db remove the "SDEV255DB" after the first single forward slash as show here
//const DBURI ='mongodb+srv://stides:Seventy7@sdev255.syrfobv.mongodb.net/?retryWrites=true&w=majority'
//connect to mongoDB
const DBURI='mongodb+srv://stides:Seventy7@SDEV255.syrfobv.mongodb.net/SDEV255DB';

mongoose.connect(DBURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=> {
        app.listen(80);
        console.log('connected to db');})
    .catch((err)=>console.log(err));
//regularly used view engine
app.set('view engine', 'ejs');

//instream parser
//app.listen(80);
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Assets'));//you must explicitly state what files are publicly accessible
app.use(express.urlencoded({extended: true}));//had error for parsing models without this on POST.save() mongoose requests
//still getting parsing error on new comments POSTing...
app.use(morgan('dev'));


app.get('*', checkLogin);
//middleware to load css
app.use('/public', express.static('public'));
//app.get('/studentHome', requireAuth, (req, res)=> res.render('studentHome'));
//app.get('/teacherHome', requireAuth, (req, res)=> res.render('teacherHome'));
//all the routes are now in /routes
app.use(FPRoutes);