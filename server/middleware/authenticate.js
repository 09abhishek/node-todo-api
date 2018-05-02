var {User} = require('./../models/user'); 

var authenticate = (req, res, next) => {
    // getting header data from the request, coz token is set in the header.
    var token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        // here we are modifying the request to forward to authenticate routes using next();
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};