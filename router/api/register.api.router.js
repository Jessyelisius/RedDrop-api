const router= require('express').Router()
const bcrypt = require('bcrypt')
const userModel = require('../../model/user.model')
const VerificationsModel = require('../../model/Verifications.model')
const { Errordisplay } = require('../../utils/Auth.utils')
const { Links, OTP } = require('../../utils/random.utils')

router.post('/',async(req,res)=>{
    
    try {
        let collect= req.body
        let password = collect.Password?(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(collect.Password))?bcrypt.hashSync(collect.Password,5):null:null
        collect.Password= password
        //saving user
        let newuser= new userModel(collect);
        let user = await newuser.save()
        //profile config
        let newverif= new VerificationsModel({
            UserID:user._id,
            Link: Links(),
            OTP:parseInt(OTP())
        })
        await newverif.save()

        return res.json({Access:true, Error:false, auth:user._id, verified:false,Data:user})
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

module.exports= router