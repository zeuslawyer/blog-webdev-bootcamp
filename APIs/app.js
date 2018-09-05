const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const url = 'https://data.melbourne.vic.gov.au/resource/dtpv-d4pf.json?$limit=';
const max_parking_results=25;

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
    request(url+max_parking_results, function(error, response, body){
        if(!error && response.statusCode ==200) {
            let _data = JSON.parse(body);
            res.render('parking.ejs', {data : _data, max_results : max_parking_results});
        } else {
            render404(req, res);
        }
    })    
    // res.render('parking.ejs');
})

app.get('/search', function(req, res){
    console.log(req.query.bay_id);
    const endpoint = 'https://data.melbourne.vic.gov.au/resource/dtpv-d4pf.json?$limit=10000&bay_id='+req.query.bay_id;
    request(endpoint, function(error, response, data){
        if(!error && response.statusCode==200) {
            var parsedBody = JSON.parse(data) //is an array
            console.log(parsedBody, req.query);
            res.render('search-results.ejs', {result: parsedBody, url: req.url, bay_id: req.query.bay_id}) ; 

        } else {
            console.log('ERROR getting data! ', error);
            let errorMessage = 'Hmmm. There is no data for the Bay ID ' + `"${req.query.bay_id}"`;
            render404(req, res, errorMessage);
        }
    })
    // res.send('<h1> WELCOME TO THE HOME PAGE</h1><p> <strong> We are glad you\'re here!</strong></p>'); 
    // res.render('home.ejs', {url: req.url});
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

function render404(request, response, errorMessage = 'Oooopsie. This page doesn\'t exist.') {
    let path = request.url;
    response.status(404).render('404.ejs',  {path:path, errorMessage: errorMessage});
}