const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//User modeli alındı
const User = require('../models/User')

module.exports = function(passport){
    passport.use(
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
    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })
    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user)
        })
    })
}