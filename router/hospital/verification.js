const router= require('express').Router()
const HospitalModel = require('../../model/Hospital.model')
const ProfileModel = require('../../model/Profile.model')
const VerificationsModel = require('../../model/Verifications.model')
const { Errordisplay } = require('../../utils/Auth.utils')
const { Sendmail } = require('../../utils/mailer.utils')
const { OTP, Links } = require('../../utils/random.utils')

router.get('/',async(req,res)=>{
    
    try {
        const auth = req.session.hospitalID    
        //checklogins
        let user=auth?auth.length==24?(await HospitalModel.findOne({_id:auth})):false:false

        if (user) {
            //reseting otp and link
            let Verifs= [OTP(),Links()]
            await VerificationsModel.updateOne({UserID:auth},{OTP:Verifs[0], Link:Verifs[1]})

            //getting email sent
            let html=`
            <html>
<head>
</head>
<body style="background-color: #FFFFFF; color: #333333; font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0;">
  <div style="background-color: #FF4136; border-bottom: 1px solid #E80000; padding: 20px;">
    <h1 style="color: #FFFFFF; margin: 0;">Verify Your Account</h1>
  </div>
  <div style="background-color: #FFFFFF; padding: 20px;">
    <h2 style="color: #FF4136; margin-top: 0;">Welcome to Reddrop!</h2>
    <p>We are excited to have you as a new member of our community. To get started, please verify your account by clicking the button below:</p>
    <a href="${process.env.website}/v/${user._id}/${Verifs[1]}" style="background-color: #FF4136; border-radius: 10px; color: #FFFFFF; display: inline-block; font-size: 16px; padding: 20px; text-decoration: none;">Verify Account</a>
    <p style="margin-top: 20px;">If you have any questions or concerns, please don't hesitate to contact us.</p>
  </div>
</body>
</html>
  `
            if (user.Verified1==false) {
                let sendmail = await Sendmail(user.Email,'Verify Account',html)
            
                return sendmail.sent?res.render('success',{msg:'Go verify your account through your email '}):res.status(500).render('500',{msg:sendmail.error})
                
            }
            return res.status(404).render('404')
        }
        
        return res.status(404).render('404')
    } catch (error) {
        res.status(500).json({Access:true, Error:Errordisplay(error).msg})
        
    }
})


router.get('/:userid/:link',async(req,res)=>{
    
  try {
      //check all params
      const auth = req.params.userid  
      const Link = req.params.link
      
      //checklogins
      const user=auth?auth.length==24?(await HospitalModel.findOne({_id:auth})):false:false
      let link = user?(await VerificationsModel.findOne({Link, UserID:user._id})):false
      
      if (link) {
        await HospitalModel.updateOne({_id:user._id},{Verified1:true})
        await VerificationsModel.updateOne({UserID:user._id},{OTP:OTP(),Link:Links()})
        let html=`
        <html>
        <head>
        </head>
        <body style="background-color: #FFFFFF; color: #333333; font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0;">
          <div style="background-color: #FF4136; border-bottom: 1px solid #E80000; padding: 20px;">
            <h1 style="color: #FFFFFF; margin: 0;">Reddrop Account Verified</h1>
          </div>
          <div style="background-color: #FFFFFF; padding: 20px;">
            <h2 style="color: #FF4136; margin-top: 0;">Congratulations!</h2>
            <p>Your account has been successfully verified. Thank you for joining our Donor!</p>
            <p style="margin-top: 20px;">If you have any questions or concerns, please don't hesitate to contact us.</p>
          </div>
        </body>
        </html>
        `
        await Sendmail(user.Email,'Account Verified',html);
        return res.render('success',{msg:'Successfully Verified account go back and login now'})
      }
      return res.status(404).render('404')
  } catch (error) {
      res.status(500).render('500',{msg:Errordisplay(error).msg})
      
  }
})


module.exports= router