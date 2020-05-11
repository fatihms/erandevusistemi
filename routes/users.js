const express = require('express')
//Bölünmüş router yapılanmalarını Router nesnesi ile bir bütün olarak yönetmek için  
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Kullanıcı modeli alındı
const User = require('../models/User')

//Giriş sayfası
router.get('/login', (req, res) => res.render('login'))

//Kayıt sayfası
router.get('/register', (req, res) => res.render('register'))

//Parolayı unuttum sayfası
router.get('/forget', (req, res) => res.render('forget'))

//Kayıt kontrol
router.post('/register', (req, res) => {
    const{name, surname, TC, email, password, password2} = req.body;
    let errors = [];

    //Boş alan kontrolü
    if(!name || !surname || !TC || !email || !password || !password2){
        errors.push({msg:'Lütfen boş alan bırakmayınız'})
    }

    //Parola kontrolü
    if(password !== password2){
        errors.push({msg:'Parola eşleşmiyor'})
    }
    //Parola karakter sayısı kontrolü
    if(password.length < 6){
        errors.push({msg:'Parola 6 karakterden az olamaz'})
    }
    //Eğer hata varsa veya yoksa
    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            surname,
            TC,
            email,
            password,
            password2
        })
    }else{
        //email kontrolü
        User.findOne({email:email})
        .then(user => {
            if(user) {
              errors.push({msg: 'Email zaten kayıtlı'})
              res.render('register', {
                    errors,
                    name,
                    surname,
                    TC,
                    email,
                    password,
                    password2
              })      
            }else{
                //yeni kullanici oluşturuluyor
                const newUser = new User({
                    name,
                    surname,
                    TC,
                    email,
                    password
                })
                //parola hashlenir 
                bcrypt.genSalt(10, (err, salt) => 
                    //hash'te şifrelenmiş veri oluşur
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'Kaydınız başarılı bir şekilde sağlanmıştır, giriş yapabilirsiniz')
                            res.redirect('/users/login')
                        })
                        .catch(err=>console.log(err))
                }))
             }
        } )
    }
})

//Login handle
router.post('/login', (req, res, next) => {
    //Server’a gelen bir yetkilendirme yani oturum açma isteğini uygun şekilde karşılanır
    passport.authenticate('user', {
      successRedirect: '/patients/appointment/1', //Başarılı olursa dashboard sayfasına gider
      failureRedirect: '/users/login', //Hata olursa login sayfasına tekrar döner
      failureFlash: true //PassportJs yetkilendirme sırasında oluşacak hatayı kullanıcıya kendiliğinden gösterecek
    })(req, res, next)
})

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Çıkış yaptınız')
    res.redirect('/users/login')
})


//Route yapısı diğer modüllere taşınmaktadır
module.exports = router