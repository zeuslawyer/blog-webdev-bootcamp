const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      methodOveride = require('method-override'),
      sanitizer = require('express-sanitizer'),
      Blog = require('./models/blogs'),
      Comment = require('./models/comments'),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      User = require('./models/users.js'),
      expressSession= require('express-session')

const dotenv = require('dotenv').config();
    
const app = express();

app.use(express.static(__dirname + '/public'));  //serve static assets in public dir
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOveride('_method'))
app.use(sanitizer());

// if db empty, then seed comments with:       Comments.generateComments();

//========================
//configure PASSPORT
//========================

app.use(expressSession({
    secret : "this is a test udemy app",
    resave : false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(viewsData); //mounted on all routes to pass User data into views/templates

//========================
// routing - ROOT routes - RESTful
//========================
app.get('/', (req, res, next) => {
    // res.send('This is the Home Page.');
    res.redirect('/blogs');
});

app.get('/blogs', function(req, res, next){
    Blog.find({  }, function(err, savedBlogs){
        if(err) {
            console.log('Error Reading from DB');
        } else {   
            res.render('index.ejs', {blogs:savedBlogs});
        }
    });
});

//========================
// AUTH routes - REGISTER & LOGIN
//========================
app.get('/register', (req, res)=>{
    res.render('register.ejs');
})

app.post('/register', (req, res)=> { 
    User.register(
        new User({username:req.body.username, displayName: req.body.displayName})
        ,req.body.password
        ,function(err, newUser) {
            if (err) { 
                console.log(err)
                return res.send('Error registering new User. ' + err.message +'.')
            } 
            passport.authenticate("local")(req, res, ()=>{
                res.redirect('/blogs')
                // res.send(newUser)
            })
        }
    );
});

app.get('/login', (req, res)=>{
    res.render('login.ejs');
})

app.post('/login'
    , passport.authenticate('local', 
        {
            // successRedirect:  '/blogs' ,
            failureRedirect: '/login',
            failureMessage: 'LOGIN FAILED'
        }
    )
    , (req, res)=> {
    //   console.log('returnPath is -->  ' + req.session.returnPath )
      res.redirect(req.session.returnPath || '/blogs');
      req.session.returnPath = undefined;
    //   console.log('deleted returnPath  :  ' + req.session.returnPath)
     } 
);

app.get('/logout', (req, res)=> {
    req.logout();
    res.redirect('/');
})


//========================
// NEW BLOG  routes
//========================

// NEW BLOG FORM => blogs/new 
app.get('/blogs/new', isUserAuthenticated, (req, res, next) => {
    // res.send('This is form for new blogs'); 
    res.render('new.ejs');

});

//SUBMIT BLOG & CREATE/save TO DB
app.post('/blogs', isUserAuthenticated, (req, res, next) => {
    let blog = req.body.blog; // req.body.blog is an object & each key is the name attribute from the form (new.ejs)
    //sanitize
    blog.body = req.sanitize(blog.body);
    //handle empty imageURL field in the form
    if (blog.imageURL=='') {
        blog.imageURL = 'https://images.unsplash.com/photo-1521335751419-603f61523713?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=da93af6c8bb9ba6b964fbb102f1f44f3&auto=format&fit=crop&w=800&q=60';
    }
    Blog.create(blog, function(err, savedBlog) {
                 if(err) {
                     console.log (err);
                 } else { 
                    savedBlog.author.id = req.user._id;
                    savedBlog.author.username = req.user.username;
                    savedBlog.author.displayName = req.user.displayName;
                    savedBlog.save()  
                     //console.log('*******SUCCESSFULLY SAVED TO DB********\n', savedBlog);
                     res.redirect('/blogs');
                 }
             });
});

//========================
// EDIT BLOG routes
//========================
// EDIT BLOG - create edit form and route to it
app.get('/blogs/:id/edit', isUserAuthenticated, checkUserIsAuthor, (req, res, next)=>{
    // res.send('EDIT PAGE');
    // Blog.findById(req.params.id, (err, blogToEdit)=> {
    //     if (err)  {
    //         res.send(" DB retrieve for EDIT didnt work");
    //     } else {
    //         res.render('edit.ejs', {blog: blogToEdit})
    //     }
    // });
    
    Blog.findById(req.params.id, function(err, blogToEdit) { 
        res.render('edit.ejs', {blog: blogToEdit})
    })
    
})

//UPDATE BLOG - update db and redirect to show page for that updated blog
app.put('/blogs/:id',isUserAuthenticated, (req, res, next)=>{
    // res.send('PUT METHOD AND UPDATE ROUTE WORKING');
    //sanitize:
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate (req.params.id, req.body.blog, (err, updatedBlog)=>{
        if (err) {
            res.send(" DB update on PUT route didnt work");
        } else {
            res.redirect('/blogs/'+req.params.id);
        }
    })
});

//========================
// DELETE / DESTROY BLOG routes
//========================
//DELETE / REMOVE blog & its comments
app.delete('/blogs/:id', isUserAuthenticated, (req, res, next)=>{
    // res.send('DELETE ROUTE WORKS')
    Blog.findByIdAndRemove(req.params.id, (err, removedBlog)=>{
        if(err) { 
            res.send('ERROR in finding/deleting from DB');
        } else {
            //delete comments associated with the blog being deleted
            console.log(`deleted Blog with id ${removedBlog._id} from database`)
            let commentRefs = removedBlog.comments;
            if (commentRefs) {
                commentRefs.forEach(function(reference){
                    Comment.findByIdAndRemove(reference, (err, deletedComment)=>{
                        if (err) {
                            res.send('error deleting comment(s) of deleted blog')
                        } else {
                            console.log(`and deleted ${removedBlog._id}'s associated comment with id ${deletedComment._id} from database`)
                        }                 
                    })
                })
            }
            res.redirect('/blogs');
        }
    });
});

//========================
// SHOW route - individual blogs
//========================

app.get('/blogs/:id', isUserAuthenticated, (req, res, next) => {
    Blog.findById(req.params.id)
        .populate('comments')  //alters comments property of blog to show the list of comments and not just _id ref
        .exec(function (err, retrievedBlog) {
            if (err)  {
                res.send(`DB retrieve for path ${req.url} didnt work`);
            } else {
                // res.send(blogToEdit
                res.render('show-single-blog.ejs', {blog: retrievedBlog})
            }
        });
});

//========================
// NEW COMMENT  routes
//========================
// COMMENTS - new comment form
app.get('/blogs/:id/comments/new', isUserAuthenticated, (req, res, next)=>{
        // res.send('THIS IS THE NEW COMMENT PAGE');
        Blog.findById(req.params.id, function(err, returnedBlog){
            if (err) {
                console.log('DB error in new comment route\n===============\n', err)
            } else {
                res.render('./newComment.ejs', {blog:returnedBlog})
            }
        });
});

//COMMENTS - POST & SAVE TO DB
app.post('/blogs/:id/comments', isUserAuthenticated, (req, res, next)=>{
    let newComment = req.body.comment
    newComment.content = req.sanitize(newComment.content);

    //store comment against blogpost
    Blog.findById(req.params.id, (err, returnedBlog)=>{
        if(err) {
            res.send('error retrieving blog from DB - Comments Routes');
        } else {
            Comment.create(newComment, (err, comment)=> {
                if(err) {
                    res.send('error sing new comment')
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.displayName = req.user.displayName;
                    comment.save();
                    returnedBlog.comments.push(comment);
                    returnedBlog.save();
                    res.redirect('/blogs/' + returnedBlog._id );
                }
            } )
        }
    })

})


//========================
// MIDDLEWARE
//========================

function isUserAuthenticated(req, res, next) {
    // console.log('=======\n' +req.path + '\n') 
    /*
        store the current req path in the session so it can be returned to  
        see : https://stackoverflow.com/questions/13335881/redirecting-to-previous-page-after-authentication-in-node-js-using-passport-js
    */
    req.session.returnPath = req.path

    if (req.isAuthenticated()){
        return next();
    }
    console.log('user not signed in --redirected to login page, and then returnPath may be used')
    res.redirect('/login')
}

function viewsData(req, res, next){
    res.locals.currentUser = req.user;  //if not logged in, then is undefined
    res.locals.pathData = req.path; //demo to show how data gets passed- each route shows  up
    next();
}

function checkUserIsAuthor(req, res, next) {
    Blog.findById(req.params.id, (err, retrievedBlog)=> {
        if (err)  {
            res.send(" DB retrieve for Blog object didnt work. Could not verify user and author");
        } else {
            // establish if authenticated user is authorised to edit/delete etc
            if (retrievedBlog.author.id && retrievedBlog.author.id.equals(req.user._id)) {
                // res.render('edit.ejs', {blog: retrievedBlog})
                console.log('Yes, you are authorised')
                next();
            } else {
                // res.send ('you are not authorised to do this.')
                res.redirect('back');
            }
        }
    });
}

//========================  
// SERVER START
//========================
const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log (`Server stared on Port ${port}`);
})