const router= require('express').Router()
const bcrypt = require('bcrypt')
const userModel = require('../../model/user.model')
const { Errordisplay } = require('../../utils/Auth.utils')

router.post('/',async(req,res)=>{
    
    try {
        let collect= req.body
        
        //checklogins
        const user= await userModel.findOne({Email:collect.Email})
        const checkpassword = user?(bcrypt.compareSync(collect.Password, user.Password)):false
        
        return checkpassword?res.json({Access:true, Error:false, auth:user._id, verified:user.Verified,Data:user}):res.json({Access:true, Error:'User details doesnt match'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

module.exports= router