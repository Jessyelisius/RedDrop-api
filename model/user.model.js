const mongoose = require('mongoose')

const Schema = mongoose.Schema

const User = new Schema({
    Email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        maxLength:[30,'Email too long'],
        minLength:[5,'Email too short']
    },
    DOB:{
        type:String,
        required:[true,'Date of birth is required'],
    },
    State:{
        type:String,
        required:[true,'State is required is required'],  
    },
    FirstName:{
        type:String,
        required:[true,'FirstName is required'],
        unique:true,
        maxLength:[12,'FirstName too long'],
        minLength:[3,'FirstName too short']
    },
    LastName:{
        type:String,
        required:[true,'LastName is required'],
        unique:true,
        maxLength:[12,'LastName too long'],
        minLength:[3,'LastName too short']
    },
    PostalCode:{
        type:Number,
        required:[true,'PostalCode is required'],
    },
    Username:{
        type:String,
        required:[true,'Username is required'],
        unique:true,
        maxLength:[12,'Username too long'],
        minLength:[4,'Username too short']
    },
    Password:{
        type:String,
        required:[true,'Password is Invalid'],
        unique:true,
        minLength:[6,'Password too short']
    },
    Verified:{
        type:Boolean,
        required:[true,'Verified is required'],
        default:false
    },
    BloodGroup:{
        type:String,
        required:[true,'BloodGroup is required'],
    },
    Genotype:{
        type:String,
        required:[true,'Genotype is required'],
    },
})


module.exports= mongoose.model('User', User)