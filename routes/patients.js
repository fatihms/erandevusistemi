const express = require('express')
//Bölünmüş router yapılanmalarını Router nesnesi ile bir bütün olarak yönetmek için  
const router = express.Router()

//Kullanıcı modeli alındı
const Appointment = require('../models/Appointment')

//Randevu sayfası
router.get('/appointment', (req, res) => res.render('patient/appointment'))

//Geçmiş randevu sayfası
router.get('/appointment-past', (req, res) => res.render('patient/appointmentpast'))

//Randevu talep sayfası
router.get('/appointment-request', (req, res) => res.render('patient/appointmentrequest'))


//Kayıt kontrol
router.post('/appointment', (req, res) => {

    const city = new Appointment(req.body)

    city.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })


})

//Route yapısı diğer modüllere taşınmaktadır
module.exports = router