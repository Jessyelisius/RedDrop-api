const router= require('express').Router()
const HospitalModel = require('../../model/Hospital.model')
const userModel = require('../../model/user.model')
const { Errordisplay } = require('../../utils/Auth.utils')

router.get('/all',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        const getHospitals = user?(await HospitalModel.find({})):false
        return getHospitals?user.Verified?res.json({Access:true, Error:false, Hospitals:getHospitals}):res.json({Access:true, Error:'User not verified'}):res.status(404).json({Access:false, Error:'User details doesnt match'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

router.get('/postalcode/:code',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        const getHospitals = user?(await HospitalModel.find({PostalCode:req.params.code?req.params.code:1})):false

        return getHospitals?user.Verified?res.json({Access:true, Error:false, Hospitals:getHospitals}):res.json({Access:true, Error:'User not verified'}):res.status(404).json({Access:false, Error:'User details doesnt match'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

router.get('/state/:Name',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        const getHospitals = user?(await HospitalModel.find({State:req.params.Name?req.params.Name:'l'})):false

        return getHospitals?user.Verified?res.json({Access:true, Error:false, Hospitals:getHospitals}):res.json({Access:true, Error:'User not verified'}):res.status(404).json({Access:false, Error:'User details doesnt match'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

module.exports= router