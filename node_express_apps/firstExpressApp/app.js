var express = require('express');
const app = express();


app.get('/', function(req, res){
    res.send('WASSUP!');
})

app.get('/dog', function(req, res){
    res.send('WOOFOOF!');
})

app.get('/bye', function(req, res){
    res.send('CIAO MAMI!!');
});

app.get('/:param1/testing-params/:param2', function(req, res){
    var param1 = req.params.param1;
    var param2= req.params.param2;
    res.send(`YOU USED ROUTE PARAMS TO GET HERE! Specifically, you used ${param1} as param1 and ${param2} as param2, to make the url ${req.url}!`);
});

// default , catchall route
app.get('*', function(req, res){
    res.send('Hmmmm...there appears to be no such page. ');
})


// SERVER RUNNING
app.listen(3000, ()=>{
    console.log('server running on port 3000...');
})