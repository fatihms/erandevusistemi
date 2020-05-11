const express = require('express')
//Bölünmüş router yapılanmalarını Router nesnesi ile bir bütün olarak yönetmek için  
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const escapeRegex = require('../config/regex-escape');
const {ensureAuthenticated} = require('../config/authd')

//Kullanıcı modeli alındı
const Appointment = require('../models/Appointment')
const User = require('../models/User')
const Doctor = require('../models/Doctor')
const appointment2 = require('../models/Appointment')
const tests = require('../models/Test')
const Polyclinic = require('../models/Polyclinic')
const tests2 = require('../models/Test')



//Randevuları Listelendiği sayfa
//router.get('/appointment-list', (req, res) => res.render('doctor/appointmentlist'))

//Randevuları Listelendiği sayfa
//router.get('/patient-list', (req, res) => res.render('doctor/patientlist'))

//Randevuların 
router.get('/announcement', (req, res) => res.render('doctor/announcement'))

router.get('/appointment', ensureAuthenticated,(req, res) => res.render('doctor/appointment',{user:req.user}))

router.post('/appointment',(req,res)=>{
  flag = 0
  errors = []
  d = new Date(req.body.date)
  d.setHours(d.getHours()+3)
  Doctor.find({_id:req.user._id},function(err,doc){
      if(err)throw err
      Appointment.find({doctorId:doc[0]._id},function(err2,appo){
          if(err2) throw err2
          appo.forEach((item)=>{
              console.log(item.date)
              console.log(d)
              if(item.date.getHours() == d.getHours()&&item.date.getMinutes()==d.getMinutes() && item.date.getMonth()==d.getMonth()&& item.date.getFullYear()==d.getFullYear()&&item.date.getDate()==d.getDate()){
                  flag = 1
                  errors.push({msg:"Aynı tarihte randevu var, randevu oluşturulamadı"})
                  console.log("buldu")
                  User.find({TC:req.body.hastaTC},function(err3,user){
                    res.render('doctor/appointment',{user:user[0],errors:errors})
                  })
              }  
          })
          if(flag == 0){
            errors.push({msg:"Randevu oluşturuldu"})
              User.find({TC:req.body.hastaTC},function(err3,user){
              const newAppo = new Appointment({userId:user[0]._id,userName:user[0].name,doctorName:doc[0].doctorName,doctorId:doc[0]._id,polyclinicName:doc[0].polyclinicName,polyclinicId:doc[0].polyclinicId,date:d})
              newAppo.save()
              console.log('yok')
              res.render('doctor/appointment',{user:user[0], errors:errors})
            })
          }
        
      })
  })
})


router.get('/giverecipes', (req,res)=> res.render('doctor/giverecipes'))

router.post('/giverecipes',ensureAuthenticated,(req,res)=>{
    d = new Date()
    User.find({TC:req.body.hastaTC},function(err,result){
        if(err) throw err
        Appointment.find({userId:result[0]._id,doctorId:req.user._id},function(err2,appo){
            if(err2) throw err2
            appo.forEach((item=>{
                if(item.date.getMonth()==d.getMonth() && item.date.getDate()==d.getDate()){
                    appointment2.findOneAndUpdate({_id:item._id},{appointmentResult:req.body.reçete},(err3,xx)=>{
                      if(err3)throw err3
                      console.log(xx)
                    })
                } 
            }))
        })
    })
    res.redirect('/doctor/giverecipes')
})

router.get('/giveTest',ensureAuthenticated,(req,res)=>{
  Polyclinic.find({},function(err,result){
      res.render('doctor/giveTest',{clinics:result})
  })
})

router.post('/giveTest',ensureAuthenticated,(req,res)=>{
  console.log(req.body.hastaTC)
  console.log(req.body.polyclinicName)
  console.log(req.body.testName)
  console.log(req.body.date)
  d = new Date(req.body.date)
  console.log(d)
  d.setHours(d.getHours()+3)
  console.log(d.getDate())
  console.log(req.body.district)
  
  User.find({TC:req.body.hastaTC},function(err,result){
      if(err)throw err
      Polyclinic.find({polyclinicName:req.body.district},function(err2,clinic){
          const newTest = new tests({userId:result[0]._id,polyclinicName:req.body.district,testName:req.body.testName,date:d,polyclinicId:clinic[0]._id,testResult:''})
          newTest.save()
      })
  })
  Polyclinic.find({},function(err2,clinic){
      res.render('doctor/giveTest',{clinics:clinic})
  })

 
})

router.get('/testresult',ensureAuthenticated,(req,res)=>{
  Polyclinic.find({},function(err,result){
      res.render('doctor/testresult',{clinics:result})
  })
})

router.post('/testresult',(req,res)=>{
  User.find({TC:req.body.hastaTC},function(err,result){
      if(err) throw err
      d = new Date(req.body.date)
      d.setHours(d.getHours()+3)
      console.log(d)
      tests.find({userId:result[0]._id,polyclinicName:req.body.district,testName:req.body.testName,date:d},function(err2,test){
          console.log(test)
          console.log(req.body.testResult)
          tests2.findByIdAndUpdate({_id:test[0]._id},{testResult:req.body.testResult},(err,xxx)=>{
              if(err) throw err
              console.log(xxx)
          })
      })
  })
})


//Geçmiş randevu sayfası
/* 
router.get('/appointment-list', (req, res) => {
  Appointment.find({},function(err,appointment){
      if (err) throw err
      console.log(appointment)

    res.render('doctor/appointmentlist',{appo : appointment})
  })
  
})*/

router.get('/appointment-list/delete/:id', ensureAuthenticated,(req, res) => {
  Appointment.findByIdAndDelete(req.params.id,function(err,bu){
    if(err) throw console.log(err)
    else{
        console.log("silindi")
    res.redirect('/doctor/appointment-list/1')}
  })
  
})
router.get('/appointment-list/accept/:id',ensureAuthenticated, (req, res) => {
  var page = req.params.page || 1
  Appointment.findByIdAndUpdate({ _id:req.params.id }, { treatment: true }, (err, result) => {
      if (err) throw err;
      console.log('onaylandı');
    });
    res.redirect('/doctor/appointment-list/1')

})

router.get('/appointment-list/:page', ensureAuthenticated,function(req, res, next) {
  var perPage = 3
  var page = req.params.page || 1
  Appointment
      .find({doctorId:req.user._id})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, appointment) {
        Appointment.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('doctor/appointmentlist', {
                  appo: appointment,
                  current: page,
                  pages: Math.ceil(count / perPage)
              })
          })
      })
})

/* 
router.get('/patient-list', (req, res) => {
  User.find({},function(err,patient){
      if (err) throw err
      console.log(patient)

    res.render('doctor/patientlist',{pat : patient})
  })
    
})*/


router.get('/patient-list/appointment/:id',ensureAuthenticated, (req, res) => {
  User.findById(req.params.id,function(err,user){
    if(err)throw err;
    console.log(user)
    res.render('doctor/appointment',{user : user})
  })
})


router.post('/doctor',ensureAuthenticated, (req, res) => { 
  const{name, surname, email} = req.body;
 
  User.findByIdAndUpdate({ _id:req.user._id }, { name: name, surname:surname }, (err, result) => {
      if (err) throw err;
      console.log('dd '+name);
    });
    res.redirect('/doctor/doctoraccount')

})

//Dashboard
router.get('/doctor',ensureAuthenticated, (req, res) => {
  res.render('doctor/doctoraccount', {doctor: req.user})
  console.log(req.user.doctorName);
})




router.post('/appointment', ensureAuthenticated,function(req, res, next) {
  var appo = new Appointment()
  

  appo.hospitalName = req.body.hospitalName
  appo.polyclinicName = req.body.polyclinicName
  appo.doctorName = req.body.doctorName

  appo.save(function(err) {
      if (err) throw err
      res.redirect('/doctor/appointment')
  })

  
})

router.get('/patient-list/:page',ensureAuthenticated, function(req, res, next) {
  var perPage = 3
  var page = req.params.page || 1
  User
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, user) {
          User.count().exec(function(err, count) {
              if (err) return next(err)
              res.render('doctor/patientlist', {
                  user: user,
                  current: page,
                  pages: Math.ceil(count / perPage)
              })
          })
      })
})

//Giriş sayfası
router.get('/login', (req, res) => res.render('doctor/login'))

//Login handle
router.post('/login',
  passport.authenticate('doctor',{ 
    successRedirect: '/doctor/appointment-list/1', 
    failureRedirect: '/doctor/login',
    failureFlash: true 
}));

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Çıkış yaptınız')
    res.redirect('/doctor/login')
})


//Route yapısı diğer modüllere taşınmaktadır
module.exports = router