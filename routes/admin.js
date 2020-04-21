const express = require('express')
//Bölünmüş router yapılanmalarını Router nesnesi ile bir bütün olarak yönetmek için  
const router = express.Router()
//Kullanıcı modeli alındı
const User = require('../models/User')

//Klinik oluştur
router.get('/hospitalcreate',(req, res) => res.render('hospitalcreate'))

//Kullanici
router.get('/patientcreate',(req, res) => res.render('admin/patientcreate'))

//Kayıt kontrol
router.post('/patientcreate', (req, res) => {

    const city = new User(req.body)

    city.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })


})


//Route yapısı diğer modüllere taşınmaktadır
module.exports = router