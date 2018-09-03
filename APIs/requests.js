const request = require('request');
const url = 'https://data.melbourne.vic.gov.au/resource/dtpv-d4pf.json?$limit=10000';



// CLOSURE
function testPrint(data){
  return (index) => {
    console.log(data[index]);
  }
}

request(url, function(err, res, body) {
  if(!err && res.statusCode == 200 ) {
    var parsedBody = JSON.parse(body)
    testPrint(parsedBody)(100); //immediately invoked function
    console.log('The occupancy status of item number 100 is:  ', parsedBody[100]["status"]);
    
    // get all that are occupied
    let results = parsedBody.filter((obj)=> {
        return obj.status.toLowerCase() !== 'unoccupied';
    })
    //get the bay_ids of all occupied spaces
    let ids = results.map(function(elem){
        return elem.bay_id;
    });

    console.log(ids.length, ids[ids.length-1]);

  } else {
    console.log('SOMETHING WRONG:' , err)
  }
});