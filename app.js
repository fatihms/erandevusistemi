require('dotenv').config()
const express = require('express')
require('express-async-errors')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const formidableMiddleware = require('express-formidable');
const bodyParser = require('body-parser')


const app = express()

//app.use(bodyParser.json())

//Passport config
require('./config/passport')(passport)

//DB yapılandırma
const db = require('./config/keys').MongoURI;

//MongoDB bağlantısı
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Bağlandı...'))
    .catch(err => console.log(err));

//EJS
//Modül aktif edildi
app.use(expressLayouts)
//“view engine” olarak “ejs” seçildi
app.set('view engine', 'ejs')

//Bodyparser
//Encode(kodlanmış/şifrelenmiş) edilmiş urller üzerinde Body-Parser’ı kullanımını kapatıyoruz
app.use(express.urlencoded({extended:false}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//connect flash
app.use(flash())

//global vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Routes
//Route yapılarının kullanılabilmesi için ilgili sınıflara “require” edilmeleri ve
//Uygulamaya “use” fonksiyonuyla tanıtılmaları gerekmektedir
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/patients', require('./routes/patients'))
app.use('/doctor', require('./routes/doctor'))
//app.use('/admin', require('./routes/admin'))
app.use('/admin',require('./routes/admin.router'))

app.use(function (req, res, next) {
    res.status(404).send("404")
  })

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Hata')
})

const port = process.env.PORT || 5000   

//Server dinleniyor
app.listen(port,console.log(`Dinleniyor: ${port} portu`))