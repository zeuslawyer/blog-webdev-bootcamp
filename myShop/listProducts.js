var faker = require('faker');
var max = 10

for (c=0; c<max; c++) {
    console.log (`Here is random productName and price #${c+1}: ${faker.commerce.productName()} , $${faker.commerce.price()}.`);
}