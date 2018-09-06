const express = require('express'),
      mongoose = require('mongoose')
      bodyParser = require('body-parser')

const app = express()

// HOME
app.get('/', (req, res) => {
    res.send('This is the Home Page.');
});





//START SERVER
const port = process.env.PORT || 3000
app.listen(port, function(){
    console.log (`Server stared on Port ${port}`);
})