const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      methodOveride = require('method-override'),
      sanitizer = require('express-sanitizer')
      Blog = require('./models/blogs');
      Comment = require('./models/comments');
    
const app = express()

app.use(express.static('public'));  //serve static assets in public dir
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOveride('_method'))
app.use(sanitizer());

// Comments.generateComments();


/** routing RESTful */
// HOME aka INDEX redirects to /blogs
app.get('/', (req, res, next) => {
    // res.send('This is the Home Page.');
    res.redirect('/blogs');
});

app.get('/blogs', function(req, res, next){
    Blog.find({}, function(err, savedBlogs){
        if(err) {
            console.log('Error Reading from DB');
        } else {
            res.render('index.ejs', {blogs:savedBlogs});
        }
    });
})

// NEW BLOG FORM => blogs/new 
app.get('/blogs/new', (req, res, next) => {
    // res.send('This is form for new blogs'); 
    res.render('new.ejs');

});

//SUBMIT BLOG & CREATE/save TO DB
app.post('/blogs', (req, res, next) => {
    let blog = req.body.blog; // req.body.blog is an object & each key is the name attribute from the form (new.ejs)
    //sanitize
    blog.body = req.sanitize(req.body.blog.body);
    //handle empty imageURL field in the form
    if (blog.imageURL=='') {
        blog.imageURL = 'https://images.unsplash.com/photo-1521335751419-603f61523713?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=da93af6c8bb9ba6b964fbb102f1f44f3&auto=format&fit=crop&w=800&q=60';
    }
    Blog.create(blog, function(err, savedBlog) {
                 if(err) {
                     console.log (err);
                 } else {
                     //console.log('*******SUCCESSFULLY SAVED TO DB********\n', savedBlog);
                     res.redirect('/blogs');
                 }
             });
});

// SHOW ROUTE - show data about each Post
app.get('/blogs/:id', (req, res, next) => {
    Blog.findById(req.params.id)
        .populate('comments')  //alters comments property of blog to show the list of comments and not just _id ref
        .exec(function (err, retrievedBlog) {
            if (err)  {
                res.send(" DB retrieve didnt work");
            } else {
                // res.send(blogToEdit
                res.render('show-single-blog.ejs', {blog: retrievedBlog})
            }
        });
});

// EDIT BLOG - create edit form and route to it
app.get('/blogs/:id/edit', (req, res, next)=>{
    // res.send('EDIT PAGE');
    Blog.findById(req.params.id, (err, blogToEdit)=> {
        if (err)  {
            res.send(" DB retrieve for EDIT didnt work");
        } else {
            res.render('edit.ejs', {blog: blogToEdit})
        }
    });
})

//UPDATE BLOG - update db and redirect to show page for that updated blog
app.put('/blogs/:id', (req, res, next)=>{
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

//DELETE / REMOVE blog
app.delete('/blogs/:id', (req, res, next)=>{
    // res.send('DELETE ROUTE WORKS')
    Blog.findByIdAndRemove(req.params.id, (err, removedBlog)=>{
        if(err) {
            res.send('ERROR in finding/deleting from DB');
        } else {
            console.log(removedBlog.comments);
            res.redirect('/blogs');
        }
    });
});


// COMMENTS - new comment
app.get('/blogs/:id/comments/new', (req, res, next)=>{
        // res.send('THIS IS THE NEW COMMENT PAGE');
        Blog.findById(req.params.id, function(err, returnedBlog){
            if (err) {
                console.log('DB error in new comment route\n===============\n', err)
            } else {
                res.render('./newComment.ejs', {blog:returnedBlog})
            }
        })
        
});

//COMMENTS - POST & SAVE TO DB
app.post('/blogs/:id/comments', (req, res, next)=>{
    let newComment = req.body.comment
    newComment.content = req.sanitize(newComment.content);

    //store comment against blogpost
    Blog.findById(req.params.id, (err, returnedBlog)=>{
        if(err) {
            res.send('error retrieving blog from DB - Comments Routes');
        } else {
            Comment.create(newComment, (err, comment)=> {
                if(err) {
                    res.send('error saving new comment')
                } else {
                    returnedBlog.comments.push(comment);
                    returnedBlog.save();
                    console.log('========================= ' , 'SAVED')
                    res.redirect('/blogs/' + returnedBlog._id );
                }
            } )
        }
    })

})


//START SERVER
const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log (`Server stared on Port ${port}`);
})