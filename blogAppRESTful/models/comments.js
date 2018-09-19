const mongoose = require('mongoose');

/**  Mongoose - CONNECT */
mongoose.connect(process.env.DB_URL || process.env.DB_LOCAL, { useNewUrlParser: true }, function(err){
    if(err){
        console.log('DB CONNECTION ERROR!   - comments model')
    }
}, { useNewUrlParser: true });


//SCHEMA
var commentSchema = new mongoose.Schema({    
    content: String,
    author: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
        username: String,
        displayName: String
    },
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
                        
    