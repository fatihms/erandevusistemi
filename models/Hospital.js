const mongoose = require('mongoose')

const HospitalShema = new mongoose.Schema({
    city:{
        type:String,
        required: true
    },
    district:{
        type:String,
        required: true
    },
    clinic:{
        type:String,
        required: true
    },
    hospital:{
        type:String,
        required: true
    }
});


//Model oluşturuyoruz, metot geri dönüş değeri olarak çeşitli metotları içeren nesne döndürür
//User adlı bir döküman oluşturuldu
const Hospital = mongoose.model('Hospital', HospitalShema)

module.exports = Hospital;