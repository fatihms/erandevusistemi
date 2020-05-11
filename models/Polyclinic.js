const {Schema, model} = require('mongoose')

const Polyclinic = model('Polyclinic', {   

      polyclinicName:{
        type:String,
        required: true  
      },
    date:{
        type:Date,
        default: Date.now
    }
});


module.exports = Polyclinic;