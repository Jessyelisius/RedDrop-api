const router= require('express').Router()
const userModel = require('../../model/user.model')
const VerificationsModel = require('../../model/Verifications.model')
const { Errordisplay } = require('../../utils/Auth.utils')
const { Sendmail } = require('../../utils/mailer.utils')
const { OTP, Links } = require('../../utils/random.utils')
const bcrypt= require('bcrypt')


router.post('/',async(req,res)=>{
    
    try {
        const auth = req.body.Email    
        //checklogins
        let user=auth?auth.length>5?(await userModel.findOne({Email:auth})):false:false

        if (user) {
            //reseting otp and link
            let Verifs= [OTP(),Links()]
            await VerificationsModel.updateOne({UserID:user._id},{OTP:Verifs[0], Link:Verifs[1]})

            //getting email sent
            let html=`
            <html>
            <head>
            </head>
            <body style="background-color: #FFFFFF; color: #333333; font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0;">
              <div style="background-color: #FF4136; border-bottom: 1px solid #E80000; padding: 20px;">
                <h1 style="color: #FFFFFF; margin: 0;"> Reddrop One-Time Password (OTP)</h1>
              </div>
              <div style="background-color: #FFFFFF; padding: 20px;">
                <p>Dear customer,</p>
                <p>Your OTP is: <strong>${Verifs[0]}</strong></p>
                <p>Please use this OTP to complete your operation.</p>
                <p style="margin-top: 20px;">Thank you for using our service!</p>
              </div>
            </body>
            </html>
            

            `
           
                let sendmail = await Sendmail(user.Email,'Reset Password OTP',html)
            
                return sendmail.sent?res.json({Access:true, Error:false,Sent:true, Email:auth}):res.status(500).json({Access:true, Error:sendmail.error})
    
        }
        
        return res.status(404).json({Access:true,Error:'User doent exist'})
    } catch (error) {
        res.status(500).json({Access:true, Error:Errordisplay(error).msg})
        
    }
})



router.post('/2',async(req,res)=>{
    
  try {
      let Collect = req.body    
      //checklogins
      const user=Collect.Email?Collect.Email.length>5?(await userModel.findOne({Email:Collect.Email})):false:false
      const getotp= user?(await VerificationsModel.findOne({UserID:user._id, OTP:Collect.OTP})):false


      if (getotp) {
        delete(Collect.Email)
        //validating password
        let Password = Collect.Password?(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(Collect.Password))?bcrypt.hashSync(Collect.Password,5):null:null

          //reseting otp and link
          let Verifs= [OTP(),Links()]
          //updatig user details
          await userModel.updateOne({_id:user._id},{Password})
          await VerificationsModel.updateOne({UserID:user._id},{OTP:Verifs[0], Link:Verifs[1]})

          //getting email sent
          let html=`
          <html>
          <head>
          </head>
          <body style="background-color: #FFFFFF; color: #333333; font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0;">
            <div style="background-color: #FF4136; border-bottom: 1px solid #E80000; padding: 20px;">
              <h1 style="color: #FFFFFF; margin: 0;">Password Reset Confirmation</h1>
            </div>
            <div style="background-color: #FFFFFF; padding: 20px;">
              <p>Dear ${user.FirstName} ${user.LastName},</p>
              <p>Your password has been successfully reset.</p>
              <p>If you did not initiate this reset, please contact us immediately.</p>
              <p style="margin-top: 20px;">Thank you for using our service!</p>
            </div>
          </body>
          </html>
                  `
         
              let sendmail = await Sendmail(user.Email,'Password Reset Successfully',html)
          
              return sendmail.sent?res.json({Access:true, Error:false,Sent:true, Reset:true}):res.status(500).json({Access:true, Error:sendmail.error, Reset:true})
  
      }
      
      return res.status(404).json({Access:true,Error:'User doent exist or invalid otp'})
  } catch (error) {
      res.status(500).json({Access:true, Error:Errordisplay(error).msg})
      
  }
})


module.exports= router