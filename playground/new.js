

var x = 10
var fun = function add (x){
    return this.x=x;
}

console.log(fun(11));