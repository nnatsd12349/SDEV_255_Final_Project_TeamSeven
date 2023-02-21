const express = require('express');
const _ = require('lodash');
//express app
const app = express();

//regularly used view engine
app.set('view engine', 'ejs');

//instream parser
app.listen(80);

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
    res.render('courses', {tittle: 'Learn'});
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

app.get('/blarg', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('blarg', {tittle: 'Post'});
});



app.use((req, res)=>{
    res.status(404).render('404', {tittle: 'Lost'});
});