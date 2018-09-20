const Comment = require('../models/comments');
const User = require('../models/users.js');
const Blog = require('../models/blogs');

//========================
// MIDDLEWARE
//========================

middleware = {}

middleware.isUserAuthenticated = (req, res, next) => {
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
    };

middleware.checkBlogAuthor = (req, res, next) => {
    Blog.findById(req.params.id, (err, retrievedBlog)=> {
        if (err)  {
            res.send(" DB retrieve for Blog object didnt work. Could not verify user and author");
        } else {
            // e stablish if authenticated user is authorised to edit/delete etc
            if ( retrievedBlog.author.id && retrievedBlog.author.id.equals(req.user._id)) {
                // res.render('edit.ejs', {blog: retrievedBlog})
                next();
            } else {
                // res.send ('you are not authorised to do this.')
                console.log(`${req.user.displayName}, you are not authorised to do this to ${retrievedBlog}.`)
                res.redirect('back');
            }
        }
    });
};

middleware.checkCommentAuthor = (req, res, next) => {
    Comment.findById(req.params.commId, (err, retrievedComment)=> {
        if (err)  {
            res.send(" DB retrieve for Comment object didnt work. Could not verify user and authorship");
        } else {
            // console.log(retrievedComment)
            // establish if authenticated user is authorised to edit/delete etc
            if ( req.user && retrievedComment.author.id.equals(req.user._id)) {
                next();
            } else {
                // console.log(`${req.user.displayName}, you are not authorised to do this to ${retrievedComment}.`)
                res.send ('you are not authorised to edit/delete comments.')
            }
        }
    });
};

middleware.viewsData = (req, res, next) => {
    res.locals.currentUser = req.user;  //if not logged in, then is undefined
    
    if (req.user) {  //if someone logged in, check if admin or not
        res.locals.adminLoggedIn = req.user.username ==='zp@zp.com' ? true : false ;
    }
    console.log('is admin logged in?  ' + (res.locals.adminLoggedIn== true ? true : false ) )
    
    res.locals.pathData = req.path; //demo to show how data gets passed- each route shows  up on upper right
    next();
};


module.exports = middleware;