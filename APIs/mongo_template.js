//Lecture 268

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/UdemyWebDev", function(err){
    if(err){
        console.log('DB CONNECTION ERROR!')
    }
});

var catSchema = new mongoose.Schema({    //object schema created from which model class generated
    name: String,
    age: Number,
    address: String,
});

var Cat = mongoose.model("Cat", catSchema);  //model class created


/*   ******SAVE NEW RECORD********  */
// var tubby = new Cat({
//     name: 'Jasper',
//     age: '5',
//     address: 'Melbourne, Australia',
// });

// tubby.save(function(err, savedObject){
//     if (err) {
//         console.log('Error saving to DB');
//     } else {
//         console.log(' SUCCESSFULLY saved the following object to DB: ', savedObject);
//     }
// });

/*   *********** RETRIEVE RECORDS ************ */
Cat.find({}, (err, results)=>{
    if(err) {
        console.log("OOPS, NO RESULTS FOUND", err);
    } else {
        // console.log("here are the results:  \n", results);
        if(results.length>0){
            results.forEach((record)=>{
                console.log(`There is a cat named ${record.name} that is aged ${record.age} and lives in ${record.address}.`)
            });
            return;
        }
        console.log('No records match that');
    }
})
