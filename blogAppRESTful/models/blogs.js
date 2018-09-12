const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

/**  Mongoose - CONNECT */
mongoose.connect(process.env.DB_HOST, function(err){
    if(err){
        console.log('DB CONNECTION ERROR!')
    }
}, { useNewUrlParser: true });


//SCHEMA
var blogSchema = new mongoose.Schema({    //object schema created from which model class generated
    title: String,
    imageURL: {type: String, default:"www.imageurlfake.com"},
    body: String,
    author: String,
    created: {type: Date, default:Date.now},
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'    
        }
    ]
        
});

// MODEL
const Blog = mongoose.model("blogPost", blogSchema);  


module.exports = Blog;
