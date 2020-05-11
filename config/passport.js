const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//Modeller alındı
const User = require('../models/User')
const Doctor = require('../models/Doctor')

function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup;
    this.details = details;
  }

module.exports = function(passport){
    passport.use('user',
        //Doğrulama-yetkilendirme isteği yollamadan önce Strategy denilen kurallar tanımlanıyor
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            //Kayıtlı kullanıcı kontrol
            User.findOne({email:email})
            .then(user =>{
                if(!user){
                    return done(null, false, {message: 'Email kayıtlı değil'})
                }
                //Parolalar eşleşiyor mu
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) throw err;
                    
                    if(isMatch){
                        return done(null, user)
                    }else{
                        return done(null, false, {message: 'parola yanlış'})
                    }
                })
            })
            .catch(err=>console.log(err))
        })
    )

      passport.use('doctor',new LocalStrategy({usernameField: 'email', passwordField: 'password'},
        function(email, password, done) {
          Doctor.findOne({ email: email }, function (err, doctor) {
            if (err) { return done(err); }
            if (!doctor) { return done(null, false); }
            if (doctor.password != password) { return done(null, false); }
            return done(null, doctor);
          });
        }
      ));

      passport.serializeUser(function (userObject, done) {
        // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
        let userGroup = "user";
        let userPrototype =  Object.getPrototypeOf(userObject);
    
        if (userPrototype === User.prototype) {
          userGroup = "user";
        } else if (userPrototype === Doctor.prototype) {
          userGroup = "doctor";
        }
    
        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
      });
    
      passport.deserializeUser(function (sessionConstructor, done) {
    
        if (sessionConstructor.userGroup == 'user') {
          User.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
              done(err, user);
          });
        } else if (sessionConstructor.userGroup == 'doctor') {
          Doctor.findOne({
              _id: sessionConstructor.userId
          }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
              done(err, user);
          });
        } 
    
      });
}