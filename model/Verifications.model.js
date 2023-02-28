const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Verifications = new Schema({
   UserID:{
    type:String,
    required:[true,'UserID required'],
    minlength:[24,'UserID too short'],
    maxLength:[24,'UserID too long']
   },
   Link:{
    type:String,
    required:[true,'Link is required'],
    minLength:[16,'Link too short'],
    maxLength:[16,'Link too Long'],
   },
   OTP:{
    type:Number,
    required:[true,'OTP is required'],
    minLength:[4,'OTP too short'],
    minLength:[4,'OTP too Long']
   },
})


module.exports= mongoose.model('Verifications', Verifications)