const express = require('express');
const _ = require('lodash');
const router = express.Router();
const controllers = require('../controllers/FPControllers');
const {requireAuth, checkLogin} = require('../middleware/authMiddleware');



/*************************** FRAGGLE HOME ***********************************/
//outstream writer
//just passing home a few variables to remind me how with reference code
router.get('/', (req, res) =>{
    //res.send('<p>Hi, there!</p>');
    const courses = [
        {name: 'Web Application Development', desc: 'HTML, CSS, JS integrated full stack development.', subject: 'CSCI', cred: 3},
        {name: 'Drawing Squares', desc: 'geometric proofs and defined orthogonality with rigorous proofs', subject: 'PHIL', cred: 3},
        {name: 'Hammer Time', desc: 'metalurgical malleability and workshop in MC Hammer pants', subject: 'MENG', cred: 4}
    ]
    const visitor = _.random(100000, 1000000000);
    res.render('index', {tittle: 'Home', courses: courses, visitor: visitor});
    
});




// this page is just a list of courses
router.get('/courses', controllers.courses_get);
router.get('/courses/:id', controllers.course_details);
//this route will be called by teacherHome to make a course with a form
router.get('/add-course', controllers.course_post);//yes this one is singular
router.post("/updateC/", controllers.course_update);
router.delete('/courses/:id', controllers.course_delete);

router.get('/newCourseForm', controllers.course_new);

router.post('/courses', controllers.course_post);



/********************** LOGIN - AUTH - VALIDATION *************************/
router.get('/loginDashboard', controllers.login_get);
/** */
router.post('/loginDashboard', controllers.login_post);//see if can authenticate

/**these may not even be needed here, they might be nested in ... oh they will be needed... */
router.get('/studentHome', requireAuth, controllers.study_get);


router.get('/teacherHome', requireAuth, controllers.teach_get);

router.get('/logout', controllers.logout_get);

router.get('/enroll', controllers.enroll_get);

router.post('/enroll', controllers.enroll_create);

/*******************************Comment Section **************************/
//home
router.get('/comment', controllers.comment_index);

//individual comment details
router.get('/comment/:id', controllers.comment_details);

//deleter
router.delete('/comment/:id', controllers.comment_delete);

//This is the Update functionality
router.post("/updateW/", controllers.comment_update);

//make new comment
router.post('/comment', controllers.comment_create);




/********************* 404 - off reservation    *************************/
router.use((req, res)=>{
    res.status(404).render('404', {tittle: 'Lost'});
});

module.exports = router;