const express = require('express');

//express app
const app = express();

//regularly used view engine
app.set('view engine', 'ejs');

//instream parser
app.listen(3000);

//outstream writer
app.get('/', (req, res) =>{
    //res.send('<p>Hi, there!</p>');
    const courses = [
        {name: 'Puke Science', desc: 'medical definition of vomitting', subject: 'BIOL', cred: 3},
        {name: 'Drawing Squares', desc: 'geometric proofs and defined orthogonality', subject: 'PHIL', cred: 3},
        {name: 'Hammer Time', desc: 'metalurgical malleability and workshop', subject: 'MENG', cred: 4}
    ]
    res.render('index', {tittle: 'EJS Var', courses: courses});
});

app.get('/about', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('about', {tittle: 'Sleep'});
});

app.get('/blarg', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('blarg', {tittle: 'Wake'});
});

app.use((req, res)=>{
    res.status(404).render('404', {tittle: 'Work'});
});