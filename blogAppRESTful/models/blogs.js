const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

/**  Mongoose - CONNECT */
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, function(err){
    if(err){
        console.log('DB CONNECTION ERROR!')
    }
}, { useNewUrlParser: true });


//SCHEMA
var blogSchema = new mongoose.Schema({
    title: String,
    imageURL: {type: String, default:"www.imageurlfake.com"},
    body: String,
    author: {
        id : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        username: String,
        displayName: String
    },
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
