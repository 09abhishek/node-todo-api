const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 5
};



var token = jwt.sign(data, '123abc');
console.log(token);


var decoded = jwt.verify(token, '123abc');



const result = token === decoded ? 'yes' : 'no';

console.log(decoded);





// var data = {
//     id: 5
// };

// var token = {
// data: data,
// hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }


// const newHash = SHA256(JSON.stringify(data) + 'somesecret').toString();

// const result = token.hash === newHash? 'yes':'no';

// console.log(result);
