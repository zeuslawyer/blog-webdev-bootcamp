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


var comment = {
    content: 'This is a test auto-generated comment #3',
    author: 'zp'
} 

// MODEL
exports.Comment = mongoose.model("Comment", commentSchema);
exports.generateComments= function() {
                            exports.Comment.create(comment, function(err, savedComment) {
                                if(err) {
                                    console.log (err);
                                } else {
                                    console.log('========================\n', savedComment);
                                }  
                            });
                        }
                        
    