const express = require('express')
//Bölünmüş router yapılanmalarını Router nesnesi ile bir bütün olarak yönetmek için  
const router = express.Router()
const {ensureAuthenticated} = require('../config/auth')

//welcome sayfası
router.get('/', (req, res) => res.render('welcome'))

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {user: req.user})
    console.log(req.user.name);
})

//Route yapısı diğer modüllere taşınmaktadır
module.exports = router