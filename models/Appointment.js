const {Schema, model} = require('mongoose')

const Appointment = model('Appointment', { 
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  userName:{
    type: String,
    require: true
  },
    hospitalName:{
      type: String,
      default: "Hastanem"
    },
    polyclinicId: {
        type: Schema.Types.ObjectId,
        ref: 'Polyclinic',
      },
    polyclinicName:{
      type: String,
      required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    doctorName: {
        type: String,
        required: true
    },
    treatment: {
      type: Boolean,
      default: false
    },
    appointmentResult: {
      type: String,
    },
    date:{
        type:Date,
        default: Date.now
    }
});

module.exports = Appointment;