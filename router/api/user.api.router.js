const router= require('express').Router()
const ProfileModel = require('../../model/Profile.model')
const userModel = require('../../model/user.model')
const { Errordisplay } = require('../../utils/Auth.utils')

router.get('/details',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        delete(user.Password);
        delete(user.__v);
        return user?res.json({Access:true,Error:false,Data:{
            Details:user,
            Profile:await ProfileModel.findOne({UserID:user._id}),
        }}):res.status(404).json({Access:true,Error:'User doent exist'})
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})



module.exports= router