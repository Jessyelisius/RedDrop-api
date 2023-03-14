const router= require('express').Router()
const DonationsModel = require('../../model/Donations.model')
const HospitalModel = require('../../model/Hospital.model')
const userModel = require('../../model/user.model')
const { Errordisplay } = require('../../utils/Auth.utils')
const { Sendmail } = require('../../utils/mailer.utils')

router.get('/all',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
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
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        const getdonations = user?(await DonationsModel.find({UserID:auth, Process:'Pending'})):false
        return getdonations?user.Verified?res.json({Access:true, Error:false, PendingDonations:getdonations, Allhospital:await HospitalModel.find({})}):res.json({Access:true, Error:'User not verified'}):res.status(404).json({Access:false, Error:'User details doesnt match'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

router.post('/add',async(req,res)=>{
    
    try {
        const auth = req.headers.authorization    
        const collect= req.body
        //checklogins
        let user=auth?auth.length==24?(await userModel.findOne({_id:auth})):false:false
        let hospi= user?user.Verified?collect.HospitalID?(await HospitalModel.findOne({_id:collect.HospitalID}))?(await HospitalModel.findOne({_id:collect.HospitalID})):false:false:false:false
        if (hospi){
            let newdonation= new DonationsModel({
                UserID:auth,
                HospitalID:collect.HospitalID,
                DatePlaced:collect.DatePlaced,
                AppointmentDate:'two weeks from dateplaced'
            })
            newdonation.save()

            let html=`
            <html>
            <head>
            </head>
            <body style="background-color: #FFFFFF; color: #333333; font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0;">
              <div style="background-color: #FF4136; border-bottom: 1px solid #E80000; padding: 20px;">
                <h1 style="color: #FFFFFF; margin: 0;">Reddrop Donation Placed</h1>
              </div>
              <div style="background-color: #FFFFFF; padding: 20px;">
                <h2 style="color: #FF4136; margin-top: 0;">Congratulations!</h2>
                <p>Your have successfully Placed for a blood donation. Thank you for joining our Donor!</p>
                <p style="margin-top: 20px;">If you have any questions or concerns, Contact <a href='mailto:${hospi.Email}'>${hospi.Email}</a></p>
              </div>
            </body>
            </html>
            `
            await Sendmail(user.Email,'Donation placed',html);

            let html2=`
            <html>
            <head>
            </head>
            <body style="background-color: #FFFFFF; color: #333333; font-family: Arial, sans-serif; font-size: 16px; margin: 0; padding: 0;">
              <div style="background-color: #FF4136; border-bottom: 1px solid #E80000; padding: 20px;">
                <h1 style="color: #FFFFFF; margin: 0;">Reddrop Donation Placed</h1>
              </div>
              <div style="background-color: #FFFFFF; padding: 20px;">
                <h2 style="color: #FF4136; margin-top: 0;">Congratulations!</h2>
                <p>A donor has requested for blood donation in your hospital. The Donor will be available within 1-2 weeks. If Donor doesnt arrive, Place Cancel on the donor on your dashboard else affirm the donation. For more of user details, check dashboard</p>
                <p style="margin-top: 20px;">If you have any questions or concerns, Contact <a href='mailto:${user.Email}'>${user.Email}</a></p>
              </div>
            </body>
            </html>
            `
            await Sendmail(user.Email,'Donation placed',html);
        return res.json({Access:true, Error:false,Donation:newdonation}) 

        }
        return res.json({Access:true, Error:'Hospital or user doesnt  or user isnt verified'}) 
    
    } catch (error) {
        res.json({Access:true, Error:Errordisplay(error).msg})
        
    }
})

router.get('/cancel/:id',async(req,res)=>{
    try {
        let auth = req.session.hospitalID
        let donationID= req.params.id

        //validate details
        const vali= auth?donationID?(donationID.length==24)?(await DonationsModel.findOne({_id:donationID, HospitalID:auth})):false:false:false
        if (vali) {
            await DonationsModel.updateOne({_id:donationID},{Process:'Cancelled'})
            return res.redirect('/dashboard')
        }
        return res.status(404).render(404)
    } catch (error) {
        return res.status(500).render('500',{msg:Errordisplay(error).msg})
    }
})

router.get('/done/:id',async(req,res)=>{
    try {
        let auth = req.session.hospitalID
        let donationID= req.params.id

        //validate details
        const vali= auth?donationID?(donationID.length==24)?(await DonationsModel.findOne({_id:donationID, HospitalID:auth})):false:false:false
        if (vali) {
            await DonationsModel.updateOne({_id:donationID},{Process:'Donated'})
            return res.redirect('/dashboard')
        }
        return res.status(404).render(404)
    } catch (error) {
        return res.status(500).render('500',{msg:Errordisplay(error).msg})
    }
})

module.exports= router