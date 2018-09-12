
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


/**  Mongoose - CONNECT */
mongoose.connect(process.env.DB_HOST, function(err){
    if(err){
        console.log('DB CONNECTION ERROR!')
    }
}, { useNewUrlParser: true });


//SCHEMA
var userSchema = new mongoose.Schema({    
    username: String,
    password: String,      
});

// PLUGIN PASSPORT
userSchema.plugin(passportLocalMongoose); 

// MODEL
const User = mongoose.model("User", userSchema);  


module.exports = User;
