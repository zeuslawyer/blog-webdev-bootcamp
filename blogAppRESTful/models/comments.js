const mongoose = require('mongoose');

/**  Mongoose - CONNECT */
mongoose.connect("mongodb://localhost/UdemyWebDev", function(err){
    if(err){
        console.log('DB CONNECTION ERROR!')
    }
}, { useNewUrlParser: true });


//SCHEMA
var commentSchema = new mongoose.Schema({    
    content: String,
    author: String,
    created: {type: Date, default:Date.now}
});


// MODEL
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

//
// function to seed comments on server start
//




// var comment = {
//     content: 'This is a test auto-generated comment #4',
//     author: 'zp'
// } 

// exports.generateComments= function() {
//                             exports.Comment.create(comment, function(err, savedComment) {
//                                 if(err) {
//                                     console.log (err);
//                                 } else {
//                                     console.log('========================\n', savedComment);
//                                 }  
//                             });
//                         }
                        
    