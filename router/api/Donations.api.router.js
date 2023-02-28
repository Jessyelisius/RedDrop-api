const router= require('express').Router()
const DonationsModel = require('../../model/Donations.model')
const HospitalModel = require('../../model/Hospital.model')
const userModel = require('../../model/user.model')
const { Errordisplay } = require('../../utils/Auth.utils')

router.get('/all',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        const user= await userModel.findOne({_id:auth})
        const getdonations = user?(await DonationsModel.find({UserID:auth})):false
        return getdonations?user.Verified?res.json({Access:true, Error:false, Donations:getdonations, Allhospital:await HospitalModel.find({})}):res.json({Access:true, Error:'User not verified'}):res.status(404).json({Access:false, Error:'User details doesnt match'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

router.get('/pending',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        const user= await userModel.findOne({_id:auth})
        const getdonations = user?(await DonationsModel.find({UserID:auth, Process:'Pending'})):false
        return getdonations?user.Verified?res.json({Access:true, Error:false, PendingDonations:getdonations, Allhospital:await HospitalModel.find({})}):res.json({Access:true, Error:'User not verified'}):res.status(404).json({Access:false, Error:'User details doesnt match'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})


module.exports= router