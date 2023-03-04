const router= require('express').Router()
const ProfileModel = require('../../model/Profile.model')
const userModel = require('../../model/user.model')
const { Errordisplay } = require('../../utils/Auth.utils')
const { uploadimg, editIMG } = require('../../utils/coudinary.utils')

router.post('/',async(req,res)=>{
    
    try {
        //check authorizations
        const auth = req.headers.authorization
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth}))?((await userModel.findOne({_id:auth})).Verified==true)?(await userModel.findOne({_id:auth})):false:false:false:false

        if (user) {
            //check for profile photo
            const chkProfile = await ProfileModel.findOne({UserID:auth});
            let collect= req.files.profile;
            //uploading the images
            let uploads= chkProfile?await editIMG(collect,chkProfile.PublicID):await uploadimg(collect)
            if (!uploads.error) {
                chkProfile?await ProfileModel.deleteOne({UserID:auth}):null
                // saving uploads 
                let newprofile = new ProfileModel({
                    UserID:auth,
                    ImgURl:uploads.url,
                    PublicID:uploads.publicID
                })
                await newprofile.save()
                return res.json({Access:true, Error:false, Profile:newprofile})
            }
            return res.status(500).json({Access:true, Error:uploads.error})

        }
        return res.status(500).json({Access:true, Error:'User doesnt exist or verified'})
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

module.exports= router