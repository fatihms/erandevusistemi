const {Schema, model} = require('mongoose')

const Test = model('Test', { 
  testName:{
    type:String,
    required: true  
  },
   testResult:{
     type:String  
     },
      hospitalName: {
        type: String,
        defauly: "Hastanem"
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      polyclinicName:{
        type: String
      },
      polyclinicId: {
        type: Schema.Types.ObjectId,
        ref: 'Polyclinic'
      },
    date:{
        type:Date,
        default: Date.now
    }
});
 

module.exports = Test;