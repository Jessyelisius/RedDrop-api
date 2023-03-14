const DonationsModel = require('../../model/Donations.model')
const userModel = require('../../model/user.model')
const { Errordisplay } = require('../../utils/Auth.utils')

const router= require('express').Router()

router.get('/',async(req,res)=>{
    try {
        //checking verification
        const sess= req.session.verified
        if (sess) {
            //getting hopsital details
            const HospID= req.session.hospitalID
            const Hospname = req.session.hospitalName


            const allhopsDonation= await DonationsModel.find({HospitalID:HospID})
            const allPendingDonation= await DonationsModel.find({HospitalID:HospID, Process:'Pending',})
            const allUser = await userModel.find({Verified:true})
            return res.render('dashboard',{Name:Hospname,allUser,allPendingDonation, allhopsDonation})
        }
        return res.status('404').render('404')
    } catch (error) {
        res.status(500).render('500',{msg:Errordisplay(error).msg})
    }
})

module.exports=router