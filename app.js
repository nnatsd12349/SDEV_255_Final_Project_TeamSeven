const express = require('express');
const _ = require('lodash');
const morgan = require('morgan');
//express app
const app = express();
const mongoose = require('mongoose');
//models
const Course = require('./models/course');
const Comment = require('./models/comment');
const Login = require('./models/login');
var comment = Comment.find({});
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
app.use(express.urlencoded({extended: true}));//had error for parsing models without this on POST.save() mongoose requests
//still getting parsing error on new comments POSTing...
app.use(morgan('dev'));



//middleware to load css
app.use('/public', express.static('public'));

/*************************** FRAGGLE HOME ***********************************/
//outstream writer
//just passing home a few variables to remind me how with reference code
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







/***************************** COURSES ***************************************/
// this page is just a list of courses
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

//this route will be called by teacherHome to make a course with a form
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







/********************Sign Up ***************************/
//create a new login entity
/**Have your way with me, God */
//until hash function is implimented just concatenate UN+PW+T or S
//on sign up page declare variable that is UN+PW+T or S and pass into hash
app.get('/add-login', (req, res)=>{
   /* const login = new Login({
        usrn: 'Teacher',
        hash: 'TeacherPasswordT',
        auth: 'T'
    });
    login.save()
        .then((result)=>{
            res.send(result)
        }).catch((err)=>{
            console.log(err);
        });*/
});

app.post('/enroll', (req, res)=>{
    const preLogin = new Login(req.body);
    console.log(preLogin);
    preLogin.hash = req.params.usrn + req.params.pswd + req.params.auth;
    console.log(preLogin);
    //console.log('post entered - debug me');
   /* Login.save()//errored out on validation for req.body being undefined
    .then((result)=>{
        res.redirect('/loginDashboard');
    }).catch((err)=>{
        console.log(err);
    }).catch(err=>{
        console.log(err);
    })*/
    
})

app.get('/enroll', (req, res)=>{
    res.render('enroll', {tittle: 'Sign Up'});
})





/********************** LOGIN - AUTH - VALIDATION *************************/
app.get('/loginDashboard', (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('loginDashboard', {tittle: 'Login'});
});
/** */
app.get('/loginDashboard/:unpw', (req, res)=>{
    const login = req.params.unpw;//Jesus is grace.
    const token = sha256(unpw).hexdigest
    Login.findByID(token)
    .then((result)=>{
        //if Teacher
        //res.render('/teacherHome', { authority: T, tittle: 'Faculty'});
        //if student
        res.render('/studentHome', { authority: S, tittle: 'Student'});
    }).catch((err)=>{
        console.log(err);
    }).catch(err=>{
        console.log(err);
    })
})








/************************Add/Drop/Delete/Update/Create/Query Courses *************/
app.get('/studentHome', (req, res) =>{
    //res.send('<p>about page</p>');
    //if no token redirect to login page
    //or anyone going straight to this page should be redirected to login
    //however, we don't want to always redirect to login if the login was successful
    res.render('studentHome', {tittle: 'Student'});
});

app.get('/teacherHome', (req, res) =>{
    //res.send('<p>about page</p>');
    //if no token redirect to login page
    res.render('teacherHome', {tittle: 'Faculty'});
});








/*******************************Comment Section **************************/
app.get('/comment', (req, res) =>{
    //res.send('<p>about page</p>');
    console.log('regular get entered')
    Comment.find().sort({createdAt: -1})
    .then((result)=>{
        console.log(result);
    res.render('comment', {tittle: 'Comment', comments: result});
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/comment/:id', (req, res)=>{
    console.log('get entered by id - debug me')
    const id = req.params.id;
    Comment.findById(id)
    .then(result=>{
        res.render('details', { comment: result, tittle: 'Browse'});
    })
    .catch(err=>{
        console.log(err);
    });
})

app.delete('/comment/:id', (req, res)=>{
    const id = req.params.id;
    Comment.findByIdAndDelete(id)
    //because AJAX request on browser side, cannot use redirect
    .then(result=>{
        res.json({redirect: '/comment'})
    })
})


//Edit Put request - how to enter this route?
app.post("/update/",(req, res)=>{
    console.log('entered put - debug me')
    var update = Comment.findByIdAndUpdate(req.body.id,{
        titl: req.body.titl,
        snip: req.body.snip,
        body: req.body.body
    });
    update.exec(function(err,data){
        if(err){
            console.log(err);
            res.redirect("/comment");
        }else{
            res.redirect("/comment");
        }
    });
});

app.post('/comment', (req, res)=>{
    const comment = new Comment(req.body);//this didn't parse it correctly?
    //console.log('post entered - debug me');
    comment.save()//errored out on validation for req.body being undefined
    .then((result)=>{
        res.redirect('/comment');
    }).catch((err)=>{
        console.log(err);
    }).catch(err=>{
        console.log(err);
    })
})




/********************* 404 - off reservation    *************************/
app.use((req, res)=>{
    res.status(404).render('404', {tittle: 'Lost'});
});