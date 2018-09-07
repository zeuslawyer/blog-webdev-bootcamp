const express = require('express'),
      mongoose = require('mongoose')
      bodyParser = require('body-parser')

const app = express()

app.use(express.static('public'));  //serve static assets in public dir
app.use(bodyParser.urlencoded({extended:true}));


/**  Mongoose - setup */
mongoose.connect("mongodb://localhost/UdemyWebDev", function(err){
    if(err){
        console.log('DB CONNECTION ERROR!')
    }
}, { useNewUrlParser: true });

var blogSchema = new mongoose.Schema({    //object schema created from which model class generated
    title: String,
    imageURL: {type: String, default:"www.imageurlfake.com"},
    body: String,
    author: String,
    created: {type: Date, default:Date.now}
});

var Blog = mongoose.model("blogPost", blogSchema);  //model class created. blogPost becomes the 'blogPosts' collection in db

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

//SUBMIT BLOG & CREATE TO DB
app.post('/blogs', (req, res, next) => {
    let blog = req.body.blog; // req.body.blog is an object & each key is the name attribute from the form (new.ejs)
    Blog.create(blog, function(err, savedBlog) {
                 if(err) {
                     console.log (err);
                 } else {
                     console.log('*******SUCCESSFULLY SAVED TO DB********\n', savedBlog);
                     res.redirect('/blogs');
                 }
             });
});

// SHOW ROUTE - show data about each Post
app.get('/blogs/:id', (req, res, next) => {
    console.log(req.params.id)
    Blog.findById(req.params.id, (err, blogpost)=> {
        if (err)  {
            res.send(" DB retrieve didnt work");
        } else {
            res.send(blogpost)
            // return
        }
    });
});




//START SERVER
const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log (`Server stared on Port ${port}`);
})