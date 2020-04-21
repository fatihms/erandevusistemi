const express = require('express')
//Bölünmüş router yapılanmalarını Router nesnesi ile bir bütün olarak yönetmek için  
const router = express.Router()

//Randevu sayfası
router.get('/appointment', (req, res) => res.render('appointment'))





//Route yapısı diğer modüllere taşınmaktadır
module.exports = router