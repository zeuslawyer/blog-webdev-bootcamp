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


/*   ******CREATE & SAVE NEW RECORD********  */

/* METHOD 1 */
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

/* METHOD 2 */
// Cat.create({name:'Dozer', age:6, address:'Perth, Western Australia' }, function(err, savedObject){
//     if (err) {
//         console.log ('OH NO, ERROR SAVING TO DB',  err);
//     } else {
//         console.log('Successfully saved the following to DB: \n', savedObject)
//     }
// })



/*   *********** RETRIEVE RECORDS ************ */
Cat.find({}, (err, results)=>{
    if(err) {
        console.log("OOPS, NO RESULTS FOUND", err);
    } else {
        console.log("\nhere are the results:  \n\n", results, '\n\n');
        if(results.length>0){
            results.forEach((record)=>{
                console.log(`There is a cat named ${record.name} that is aged ${record.age} and lives in ${record.address}.`)
            });
            return;
        }
        console.log('No records match that');
    }
})
