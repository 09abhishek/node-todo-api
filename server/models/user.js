const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


// {
//   email: 'abhi@example.com',
//   password: 'adpsofijasdfmpoijwerew',
//   tokens: [{
//     access: 'auth',
//     token: 'poijasdpfoimasdpfjiweproijwer'
//   }]
// }

// old code before creating custom schema

// var User = mongoose.model('User', {
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 1,
//     unique: true,
//     validate: {
//       validator: validator.isEmail,
//       message: '{VALUE} is not a valid email'
//     }
//   },
//   password: {
//     type: String,
//     require: true,
//     minlength: 6
//   },
//   tokens: [{
//     access: {
//       type: String,
//       required: true
//     },
//     token: {
//       type: String,
//       required: true
//     }
//   }]
// });


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

// overriding the regular function (toJSON) which converts the moogese model to json and send back to the requester method. (hence we are limitng the properties to show)

UserSchema.methods.toJSON = function () {
  var user = this;
  // the toObject do the majic it converts the model into the respecitve object with properties.
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

//we are assigning the custom method generateAuthToken over it.
// it is a instance method

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

  user.tokens.unshift({ access, token });

  return user.save().then(() => {
    return token;
  });
};


// statics object is kind of method which creates => model method

UserSchema.statics.findByToken = function (token) {
     var User = this;

     try {
          var decoded = jwt.verify(token, 'abc123');
        //  console.log(decoded);

     } catch (e) {
          // return new Promise((resolve, reject) => {
          //  reject();  or 
          return Promise.reject();
     }
     return User.findOne({
          '_id': decoded._id,
          'tokens.token': token,
          'tokens.access': 'auth'
     });
};



var User = mongoose.model('User', UserSchema);

module.exports = {User}