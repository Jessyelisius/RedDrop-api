const router= require('express').Router()
const bcrypt = require('bcrypt')
const HospitalModel = require('../../model/Hospital.model')
const { Errordisplay } = require('../../utils/Auth.utils')

router.get('/',async(req,res)=>{
    res.render('login',{msg:'login to your details'})
})

router.post('/',async(req,res)=>{
    
    try {
        let collect= req.body
        
        //checklogins
        const user= await HospitalModel.findOne({Email:collect.Email})
        const checkpassword = user?(bcrypt.compareSync(collect.Password, user.Password)):false

        if (checkpassword!=false) {
            req.session.hospitalID= user._id
            req.session.hospitalName = user.Name
            req.session.verified= user.Verified1
            return user.Verified1?res.redirect('/dashboard'):res.redirect('/v')
        }
        
        return res.render('login',{msg:'user does not exist'})
    
    } catch (error) {
        res.render('login',{msg:Errordisplay(error).msg})
        
    }
})

module.exports= router