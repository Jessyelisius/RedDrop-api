const router= require('express').Router()
const ProfileModel = require('../../model/Profile.model')
const userModel = require('../../model/user.model')
const VerificationsModel = require('../../model/Verifications.model')
const { Errordisplay } = require('../../utils/Auth.utils')
const { Sendmail } = require('../../utils/mailer.utils')
const { OTP, Links } = require('../../utils/random.utils')

router.get('/details',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        user?delete(user.Password):null;
        user?delete(user.__v):null;
        return user?res.json({Access:true,Error:false,Data:{
            Details:user,
            Profile:await ProfileModel.findOne({UserID:user._id}),
        }}):res.status(404).json({Access:true,Error:'User doent exist'})
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})


router.get('/edit',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false

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
           
                let sendmail = await Sendmail(user.Email,'Edit Details OTP',html)
            
                return sendmail.sent?res.json({Access:true, Error:false,Sent:true, Data:auth}):res.status(500).json({Access:true, Error:sendmail.error})
    
        }
        
        return res.status(404).json({Access:true,Error:'User doent exist'})
    } catch (error) {
        res.status(500).json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

router.post('/edit',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        let collect = req.body
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        let checkOTP= user?(await VerificationsModel.findOne({UserID:auth, OTP:collect.OTP})):false
        if (checkOTP) {

            //Deleting all unnecessary parameters
            delete(collect.Password)
            delete(collect.Email)
            delete(collect.Username)

            //reseting otp and link
            let Verifs= [OTP(),Links()]
            await userModel.updateOne({UserID:auth}, collect)
            await VerificationsModel.updateOne({UserID:user._id},{OTP:Verifs[0], Link:Verifs[1]})

            let users=await userModel.findOne({_id:auth})
            //getting email sent
            let html=`
            <html>
            <head>
            </head>
            <body style="background-color: #FFFFFF; color: #333333; font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0;">
              <div style="background-color: #FF4136; border-bottom: 1px solid #E80000; padding: 20px;">
                <h1 style="color: #FFFFFF; margin: 0;">Reddrop Account Details Edited</h1>
              </div>
              <div style="background-color: #FFFFFF; padding: 20px;">
                <p>Dear ${users.FirstName} ${users.LastName},</p>
                <p>Your account details have been edited.</p>
                <p>If you did not initiate these changes, please contact us immediately or go to your app and edit again.</p>
                <p style="margin-top: 20px;">Thank you for using our service!</p>
              </div>
            </body>
            </html>
            
            

            `
           
                let sendmail = await Sendmail(users.Email,'Succefully Edited Details',html)
            
                return sendmail.sent?res.json({Access:true, Error:false,Sent:true, Data:await userModel.findOne({_id:auth})}):res.status(500).json({Access:true, Error:sendmail.error, Data:await userModel.findOne({_id:auth})})
    
        }
        
        return res.status(404).json({Access:true,Error:'User doent exist or incorrect OTP'})
    } catch (error) {
        res.status(500).json({Access:true, Error:Errordisplay(error).msg})
        
    }
})


module.exports= router