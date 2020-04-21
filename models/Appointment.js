const mongoose = require('mongoose')

const AppointmentShema = new mongoose.Schema({
    city:{
        type:String,
        required: true
    }
});


//Model oluşturuyoruz, metot geri dönüş değeri olarak çeşitli metotları içeren nesne döndürür
//User adlı bir döküman oluşturuldu
const Appointment = mongoose.model('Appointment', AppointmentShema)

module.exports = Appointment;