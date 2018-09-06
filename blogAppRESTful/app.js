const express = require('express'),
      mongoose = require('mongoose')
      bodyParser = require('body-parser')

const app = express()

app.use(express.static('public'));  //serve static assets in public dir
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost/UdemyWebDev", function(err){
    if(err){
        console.log('DB CONNECTION ERROR!')
    } else {
        console.log('\n>> DB CONNECTED\n');
    }
});



// HOME
app.get('/', (req, res, next) => {
    res.send('This is the Home Page.');
});





//START SERVER
const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log (`Server stared on Port ${port}`);
})