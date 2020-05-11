const express = require('express')
//Bölünmüş router yapılanmalarını Router nesnesi ile bir bütün olarak yönetmek için  
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

//Modeller alındı
const tests = require('../models/Test')
const appointment = require('../models/Appointment')
const polyclinic = require('../models/Polyclinic')
const doctor = require('../models/Doctor')
const doctor2 = require('../models/Doctor')
const User = require('../models/User')

router.post('/appointment/:page',ensureAuthenticated,(req,res)=>{
    let flag = 0
    let errors = [];
    d = new Date(req.body.date)
    d.setHours(d.getHours()+3)
    doctor.find({doctorName:req.body.district},function(err,doc){
        if(err)throw err
        appointment.find({doctorId:doc[0]._id},function(err2,appo){
            if(err2) throw err2
            appo.forEach((item)=>{
                console.log(item.date)
                console.log(d)
                if(item.date.getHours() == d.getHours()&&item.date.getMinutes()==d.getMinutes() && item.date.getMonth()==d.getMonth()&& item.date.getFullYear()==d.getFullYear()&&item.date.getDate()==d.getDate()){
                    flag = true
                    errors.push({msg:'Randevu Talep Ettiğiniz Saat Dolu'})
                    console.log("buldu")
                }  
            })
            if(flag === 0){
                const newAppo = new appointment({userId:req.user._id,userName:req.user.name,doctorName:doc[0].doctorName,doctorId:doc[0]._id,polyclinicName:doc[0].polyclinicName,polyclinicId:doc[0].polyclinicId,date:d})
                newAppo.save()
                errors.push({msg:'Randevunuz Başarılı Bir Şekilde Oluşturuldu'})
            }
          
    var perPage = 3
    var page = req.params.page || 1
    tests
        .find({userId:req.user._id})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, user) {
            tests.count().exec(function(err, count) {
                if (err) return next(err)
                d = new Date()
                doctor2.find({},function(err3,docs){
                res.render('patient/appointment', {
                    errors:errors,
                    d:d,
                    docs:docs,
                    test: user,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
        })
            
        })
    })
})


router.get('/appointment/:page', ensureAuthenticated, function(req, res, next) {
    
    var perPage = 3
    var page = req.params.page || 1
    tests
        .find({userId:req.user._id})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, user) {
            tests.count().exec(function(err, count) {
                if (err) return next(err)
                d = new Date()
                doctor.find({},function(err3,docs){
                res.render('patient/appointment', {
                    d:d,
                    docs:docs,
                    test: user,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
        })
  })

router.post('/patient', ensureAuthenticated, (req, res) => { 
    const{name, surname, email} = req.body;
   
    User.findByIdAndUpdate({ _id:req.user._id }, { name: name, surname:surname, email:email }, (err, result) => {
        if (err) throw err;
        
      });
      res.redirect('/patients/patient')

})

//Dashboard
router.get('/patient', ensureAuthenticated, (req, res) => {
    res.render('patient/patient', {user: req.user})
    console.log(req.user.name);
})

router.get('/appointment-past/:page', ensureAuthenticated, function(req, res, next) {
    var perPage = 3
    var page = req.params.page || 1
    appointment
        .find({userId:req.user._id})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, user) {
            appointment.count().exec(function(err, count) {
                if (err) return next(err)
                d = new Date()
                d.setHours(d.getHours()+3)
                res.render('patient/appointmentpast', {
                    appo: user,
                    d:d,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
  })


//Randevu talep sayfası
router.get('/appointment-request/:page', (req, res) => {
    appointment.find({userId:req.user._id},function(err,item){
        if (err) throw err
        d = new Date()
        d.setHours(d.getHours()+3)
        console.log(d)
        console.log(item)
        res.render('patient/appointmentrequest',{appo : item,d:d})
    })
    
})

router.get('/test-result/:page', ensureAuthenticated, function(req, res, next) {
    var perPage = 4
    var page = req.params.page || 1
    tests
        .find({userId:req.user._id})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, appointment) {
            tests.count().exec(function(err, count) {
                if (err) return next(err)
                d = new Date()
                d.setHours(d.getHours()+3)
                res.render('patient/testresult', {
                    test: appointment,
                    d:d,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
  })

router.post('/appointment', ensureAuthenticated, function (req, res) {
    console.log(req.body.district);
 });

//Route yapısı diğer modüllere taşınmaktadır
module.exports = router
