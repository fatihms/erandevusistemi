const {Schema, model} = require('mongoose')

const Doctor = model('Doctor', { 
  doctorName:{
    type: String
},
doctorSurname:{
  type: String
},
    hospitalName: {
       type: String,
       default: "Hastanem"
      },
      polyclinicId: {
        type: Schema.Types.ObjectId,
        ref: 'Polyclinic',
      },
      polyclinicName:{
        type: String
      },
    password:{
      type:String,
      required: true
    },
    email:{
    type:String,
    required: true
    },

    date:{
      type:Date,
      default: Date.now
  }
});


module.exports = Doctor;