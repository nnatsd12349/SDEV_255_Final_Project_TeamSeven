// All controllers for just the comments functionality
const Comment = require('../models/comment');
const Login = require('../models/login');
const Course = require('../models/course');
var comment = Comment.find({});
var course = Course.find({});
const jwt = require('jsonwebtoken');

//amazing Error Handler of awesome, thank you NetNinja
const handleErrors = (err)=>{
    //console.log(err.message);
    //console.log(err.message, err.code);
    
    let errors = { usrn: '', hash: '', yous: ''};
 
        if(err.message === 'incorrect email'){
            errors.usrn = 'Email not registered.';
        }
        if(err.message === 'incorrect password'){
            errors.hash = 'Password is Incorrect';
        }
    //non-unique usrn
    if (err.code===11000){
        console.log('err code detected');
        errors.usrn = 'That email is already registered.';
        return errors;
    }

    //validation errors
    if (err.message.includes('Login validation failed')){
       Object.values(err.errors).forEach(({properties})=>{
        //console.log(properties);
        errors[properties.path]=properties.message;
        });
    }
    return errors;
}//closer

const maxAge = 2*60*60;
const createToken = (id)=>{
    return jwt.sign({id}, 'team7rocks!', {
        expiresIn: maxAge
    });
}

const comment_index = (req, res) =>{
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
}

const comment_details = (req, res)=>{
    console.log('get entered by id - debug me')
    const id = req.params.id;
    Comment.findById(id)
    .then(result=>{
        res.render('details', { comment: result, tittle: 'Browse'});
    })
    .catch(err=>{
        console.log(err);
    });
}

const comment_delete = (req, res)=>{
    const id = req.params.id;
    Comment.findByIdAndDelete(id)
    //because AJAX request on browser side, cannot use redirect
    .then(result=>{
        res.json({redirect: '/comment'})
    })
}

const comment_update = (req, res)=>{
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
}

const comment_create = (req, res)=>{
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
}

/********************Sign Up ***************************/

const enroll_create = async (req, res) =>{
    const {usrn, hash, yous} = req.body;
    //usrn is email
    //hash is a hash of password secret
    //auth is T or S for differenciation
    try {
       const login = await Login.create({usrn, hash, yous});
       const token = createToken(login._id);
       res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
       console.log('returning id');
       res.status(201).json({login: login._id});//had to take out login: before login._id //will probably resolve
    } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({errors});
    }
}

const enroll_get = (req, res)=>{
    res.render('enroll', {tittle: 'Sign Up'});
}

/********************LOGIN SECTION OF LOGIN ***************************/

const login_get = (req, res) =>{
    //res.send('<p>about page</p>');
    res.render('loginDashboard', {tittle: 'Login'});
};

const login_post = async (req, res) =>{
    const { usrn, hash}=req.body;
    console.log('login post reached');
    try{
        const login = await Login.login(usrn, hash);//keep an eye on what this login means
        const token = createToken(login._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({login: login._id, type: login.yous});
        console.log('user logged in');//this is firing if password is incorrect

    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
    //res.render('loginDashboard', {tittle: 'Login'});
};

const logout_get = (req, res)=>{//may need to do another way
    res.cookie('jwt', 'logged out', { maxAge: 1});
    res.redirect('/');
  }


 const study_get = (req, res) =>{
    //if no token redirect to login page
    (console.log('study_get has been called'));
    Course.find().sort({levl: 1})
    .then((result)=>{
    res.render('studentHome', {tittle: 'Study', courses: result});
    })
    .catch((err)=>{
    console.log(err);
    });
 };
 
 const teach_get = (req, res) =>{
    //if no token redirect to login page
    Course.find().sort({levl: 1})
    .then((result)=>{
    res.render('teacherHome', {tittle: 'Learn', courses: result});
    })
    .catch((err)=>{
    console.log(err);
    });
};
/***********************************COURSES SECTION*******************************************/
const courses_get = (req, res)=>{
Course.find().sort({levl: 1})
.then((result)=>{
    res.render('courses', {tittle: 'Learn', courses: result});
})
.catch((err)=>{
    console.log(err);
});
}
////CURRENT WORK HERE
const course_details = (req, res)=>{
    console.log('get entered by id - debug me')
    const id = req.params.id;
     Course.findById(id)
    .then(result=>{
        res.render('courseDetails', { course: result, tittle: 'Browse'});
    })
    .catch(err=>{
        console.log(err);
    });
    }
    

const course_post = (req, res)=>{
    const course = new Course({
        name: req.body.name,
        desc: req.body.desc,
        dept: req.body.dept,
        //add a sylb to the course model to add syllabus info
        levl: req.body.levl,
        preq: req.body.preq,
        cred: req.body.cred
    });
    course.save()
    .then((result)=>{
        res.redirect('/teacherHome');
    }).catch((err)=>{
        console.log(err);
    }).catch(err=>{
        console.log(err);
    })
};


const course_update = (req, res)=>{
    console.log('entered put - debug me')
    var updateC = Course.findByIdAndUpdate(req.body.id,{
        name: req.body.name,
        desc: req.body.desc,
        dept: req.body.dept,
        levl: req.body.levl,
        preq: req.body.preq,
        cred: req.body.cred
    });
    updateC.exec(function(err,data){
        if(err){
            console.log(err);
            res.redirect("/teacherHome");
        }else{
            res.redirect("/teacherHome");
        }
    });
}

const course_new = (req, res)=>{//may need to do another way
    console.log('teacher making new course');
    res.render('newCourseForm');
  }

const course_delete = (req, res)=>{
    const id = req.params.id;
    Course.findByIdAndDelete(id)
    //because AJAX request on browser side, cannot use redirect
    .then(result=>{
        res.json({redirect: '/teacherHome'})
    })
}
/***************************** COURSES ***************************************/


/*Summery of routes*/
module.exports = {
    comment_index,//comment home that shows all the comments
    comment_details,//loads a particular comment
    comment_delete,//can delete a comment
    comment_update,//makes updates to a comment and should NOT require a jwt unless I want to make an edit function to edit your own comment
    comment_create,//makes a new comment and should NOT require a jwt
    enroll_create,//posts new login to the database
    enroll_get,//throws up the page
    courses_get,//public page of courses listed
    course_post,//write a course to the database
    login_get,//go to login page
    login_post,//try authenticate
    study_get,
    teach_get,
    logout_get,//clears jwt and redirects to home page
    course_details,
    course_update,
    course_delete,
    course_post,
    course_new
}