const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Profiles = new Schema({
   UserID:{
    type:String,
    required:[true,'UserID required'],
    minlength:[24,'UserID too short'],
    maxLength:[24,'UserID too long']
   },
   PublicID:{
    type:String,
    required:[true,'PublicID required'],
   },
   ImgURl:{
    type:String,
    required:[true,'ImgURl required'],
   },
})


module.exports= mongoose.model('Profiles', Profiles)