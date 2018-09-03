const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const url = 'https://data.melbourne.vic.gov.au/resource/dtpv-d4pf.json?$limit=100';

const app = express();

let posts = [
    {title: 'Zubin missies Rowie', author: 'Zubin Pratap'},
    {title: 'I love to code', author: 'Zubin Pratap'},
    {title: 'I sometimes worry about the future', author: 'Zubin Pratap'},
    {title: 'Frankie goes to Hollywood', author: 'Zp Keshavar'}
]
let friends = ["TJ", "Stuart", "Maggie", "Pippa", "Zorro"];

app.use(express.static('public'));  //serve static assets in public dir
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', function(req, res){
    // res.send('<h1> WELCOME TO THE HOME PAGE</h1><p> <strong> We are glad you\'re here!</strong></p>'); 
    res.render('home.ejs', {url: req.url});
})

app.get('/parking', function(req, res){
    request(url, function(error, response, body){
        if(!error && response.statusCode ==200) {
            let data = JSON.parse(body);
            res.render('parking.ejs', {data : data});
        } else {
            render404(req, res);
        }
    })    
    // res.render('parking.ejs');
})

app.get('/posts', function(req, res){
    res.render('posts.ejs', {posts:posts})  
});

app.get('/friends', function(req, res){
    res.status(200).render('form-add-friend.ejs', {friends:friends})  
});

app.post('/add-friend', function(req, res){
    let friend = req.body.newfriend;
    friends.push(friend);
    res.status(200).redirect('/friends');
});

// route params and variables
app.get('/:param1/pathvar /:param2', function(req, res){
    var param1 = req.params.param1;
    var param2= req.params.param2;
    res.send(`YOU USED ROUTE PARAMS TO GET HERE! Specifically, you used ${param1} as param1 and ${param2} as param2, to make the url ${req.url}!`);
});

// default , catchall route
app.get('*', function(req, res){
    render404(req, res);

})


// SERVER RUNNING
let port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`server running on port ${port}...`);
})

function render404(request, response) {
    let path = request.url;
    let errorMessage = 'Oooopsie. This page doesn\'t exist.';
    response.status(404).render('404.ejs',  {path:path, errorMessage: errorMessage});
}