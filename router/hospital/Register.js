const router= require('express').Router()
const bcrypt = require('bcrypt')
const HospitalModel = require('../../model/Hospital.model')
const userModel = require('../../model/user.model')
const VerificationsModel = require('../../model/Verifications.model')
const { Errordisplay } = require('../../utils/Auth.utils')
const { uploadimg } = require('../../utils/coudinary.utils')
const { Links, OTP } = require('../../utils/random.utils')

router.get('/',async (req,res)=>{
    res.render('register',{msg:'fill the form'})
})

router.post('/',async(req,res)=>{
    
    try {
        let collect= req.body
        let password = collect.Password?(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(collect.Password))?bcrypt.hashSync(collect.Password,5):null:null
        collect.Password= password

        // uploading image 
        let img1= req.files.HospitalDoc1
        let img2= req.files.HospitalDoc2

        let upload1= await uploadimg(img1);
        let upload2 = await uploadimg(img2);

        //validating image
        let validate = (!upload1.error && !upload2.error)?true:false

        if (validate==true) {
            collect.HospitalDoc1= upload1.url 
            collect.HospitalDoc2= upload2.url 
            collect.Verified2=true
            //saving user
        let newuser= new HospitalModel(collect);
        let user = await newuser.save()
        //profile config
        let newverif= new VerificationsModel({
            UserID:user._id,
            Link: Links(),
            OTP:parseInt(OTP())
        })
        await newverif.save()
        req.session.hospitalID= newuser._id
        req.session.hospitalName = newuser.Name
        req.session.verified= false
        return res.redirect('/v')

        }
        
        return res.render('register',{msg:(upload1.error?upload1.error:upload2.error)}) 
    
    } catch (error) {
        res.render('register',{msg:Errordisplay(error).msg})
        
    }
})

module.exports= router