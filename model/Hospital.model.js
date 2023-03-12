const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Hospital = new Schema({
    Email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        maxLength:[30,'Email too long'],
        minLength:[7,'Email too short'],
    },
    State:{
        type:String,
        required:[true,'State is required is required'],  
    },
    Name:{
        type:String,
        required:[true,'Name is required'],
        unique:true,
        maxLength:[30,'Name too long'],
        minLength:[7,'Name too short']
    },
    Location:{
        type:String,
        required:[true,'Location is required'],
        unique:true,
        maxLength:[50,'Location too long'],
        minLength:[6,'Location too short']
    },
    PostalCode:{
        type:Number,
        required:[true,'PostalCode is required'],
    },
    PhoneNumber:{
        type:String,
        required:[true,'Phone number is required'],
        unique:true,
        maxLength:[11,'Phone number too long'],
        minLength:[11,'Phone number too short']
    },
    Password:{
        type:String,
        required:[true,'Invalid password'],
        minLength:[6,'Invalid password']
    },
    Verified1:{
        type:Boolean,
        required:[true,'Verified is required'],
        default:false
    },
    HospitalDoc1:{
        type:String,
        required:[true,'HospitalDoc1 is required'],
    },
    HospitalDoc2:{
        type:String,
        required:[true,'HospitalDoc2 is required'],
    },
    Verified2:{
        type:Boolean,
        required:[true,'Verified2 is required'],
        default:false
    },
})


module.exports= mongoose.model('Hospital', Hospital)