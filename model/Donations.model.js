const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Donations = new Schema({
   UserID:{
    type:String,
    required:[true,'UserID required'],
    minlength:[24,'UserID too short'],
    maxLength:[24,'UserID too long']
   },
   HospitalID:{
    type:String,
    required:[true,'HospitalID required'],
    minlength:[24,'HospitalID too short'],
    maxLength:[24,'HospitalID too long']
   },
   Process:{
    type:String,
    required:[true,'Process is required'],
    enum:['Pending', 'Donated', 'Cancelled'],
    default:'Pending'
   },
   DatePlaced:{
    type:String,
    required:[true,'DatePlaced is required'],
   },
   AppointmentDate:{
    type:String,
    required:[true,'DatePlaced is required'],
    default:'Yet to be appointed'
   },
})


module.exports= mongoose.model('Donations', Donations)