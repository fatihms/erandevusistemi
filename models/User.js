const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    surname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    age:{
        type:Number,
        required: false
    },
    date:{
        type:Date,
        default: Date.now
    }
});


//Model oluşturuyoruz, metot geri dönüş değeri olarak çeşitli metotları içeren nesne döndürür
//User adlı bir döküman oluşturuldu
const User = mongoose.model('User', UserShema)

module.exports = User;