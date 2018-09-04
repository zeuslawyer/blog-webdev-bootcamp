// THIS FILE DOES NOTHING BUT DEMO USE OF REQUEST. NO HELPER FUNCTIONS HERE.

const request = require('request');
// const url = 'https://data.melbourne.vic.gov.au/resource/dtpv-d4pf.json?$limit=10000';
const url = 'https://data.melbourne.vic.gov.au/resource/dtpv-d4pf.json?$limit=10000&bay_id=2020'


// CLOSURE
function testPrint(data){
  return (index) => {
    console.log(data[index]);
  }
}

//REQUEST library practice code
request(url, function(err, res, body) {
  if(!err && res.statusCode == 200 ) {
    var parsedBody = JSON.parse(body)
    console.log('parsed Body is: ', parsedBody)

    // testPrint(parsedBody)(100); //use immediately invoked function for fun
    // console.log('The occupancy status of item number 100 is:  ', parsedBody[100]["status"]);
    
    // get all that are occupied
    let results = parsedBody.filter((obj)=> {
        return obj.status.toLowerCase() !== 'unoccupied';
    })
    //get the bay_ids of all occupied spaces
    let ids = results.map(function(elem){
        return elem.bay_id;
    });

    //lenght of occupied spaces array, and the last one
    console.log(ids.length,  'spaces are unoccupied, and the last one in the array is: ', ids[ids.length-1]);

  } else {
    console.log('SOMETHING WRONG:' , err)
  }
});