const express = require('express');
const _ = require('lodash');
const morgan = require('morgan');
//express app
const app = express();
const mongoose = require('mongoose');
const Course = require('./models/course');
const Comment = require('./models/comment');

//to write to SDEV255DB db, add "SDEV255DB" into the uri as shown here:
//const DBURI ='mongodb+srv://stides:Seventy7@sdev255.syrfobv.mongodb.net/SDEV255DB?retryWrites=true&w=majority'
//to write to test db remove the "SDEV255DB" after the first single forward slash as show here
//const DBURI ='mongodb+srv://stides:Seventy7@sdev255.syrfobv.mongodb.net/?retryWrites=true&w=majority'
//connect to mongoDB
const DBURI='mongodb+srv://stides:Seventy7@SDEV255.syrfobv.mongodb.net/SDEV255DB?retryWrites=true&w=majority';

mongoose.connect(DBURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=> {
        app.listen(80);
        console.log('connected to db');})
    .catch((err)=>console.log(err));
//regularly used view engine
app.set('view engine', 'ejs');

//instream parser
//app.listen(80);

app.use(express.static('Assets'));//you must explicitly state what files are publicly accessible
app.use(morgan('dev'));



//middleware to load css
app.use('/public', express.static('public'));

//outstream writer
app.get('/', (req, res) =>{
    //res.send('<p>Hi, there!</p>');
    const courses = [
        {name: 'Puke Science', desc: 'medical definition of vomitting', subject: 'BIOL', cred: 3},
        {name: 'Drawing Squares', desc: 'geometric proofs and defined orthogonality', subject: 'PHIL', cred: 3},
        {name: 'Hammer Time', desc: 'metalurgical malleability and workshop', subject: 'MENG', cred: 4}
    ]
    const visitor = _.random(100000, 1000000000);
    res.render('index', {tittle: 'Home', courses: courses, visitor: visitor});
    
});

app.get('/courses', (req, res) =>{
    //res.send('<p>about page</p>');
    Course.find().sort({levl: 1})
        .then((result)=>{
            res.render('courses', {tittle: 'Learn', courses: result});
        })
        .catch((err)=>{
            console.log(err);
        })
});
app.get('/add-course', (req, res)=>{
    const course = new Course({
        name: 'change me',
        desc: 'change my text and go to my url to insert into db.',
        dept: 'DBDB',
        levl: 147,
        preq: 1,
        cred: 4
    });
    course.save()
        .then((result)=>{
            res.send(result)
        }).catch((err)=>{
            console.log(err);
        });
});
app.get('/loginDashboard', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('loginDashboard', {tittle: 'Login'});
});

app.get('/studentHome', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('studentHome', {tittle: 'Student'});
});

app.get('/teacherHome', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('teacherHome', {tittle: 'Faculty'});
});

app.get('/comment', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('comment', {tittle: 'Post'});
});



app.use((req, res)=>{
    res.status(404).render('404', {tittle: 'Lost'});
});