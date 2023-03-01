const express = require('express')
const app = express()
const port = 4000
//dotenv
require('dotenv').config()

//cors
app.use(require('cors')())

//ejs
app.set('view engine','ejs')

//public
app.set(express.static('public'))

// bodyparser 
const bodyparser= require('body-parser')
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json({extended:true}))

// fileupload 
app.use(require('express-fileupload')({useTempFiles:true}))

//session
app.use(require('express-session')({resave:false,secret:process.env.sessSecret,saveUninitialized:true,cookie:{maxAge:604800000}}))

//morgan
app.use(require('morgan')('dev'))

//mongoose
const mongoose = require('mongoose')
mongoose.set('strictQuery',true)
mongoose.set('runValidators',true)
mongoose.connect(process.env.mongo).then(res=>{
    console.log('connected');
    app.listen(port, () => console.log(`http://localhost:${port}/`))

})


//////////////////////Api routes/////////////////
app.use('/api/register',require('./router/api/register.api.router'))//register

app.use('/api/login',require('./router/api/login.api.router'))//login

app.use('/api/donations',require('./router/api/Donations.api.router'))//Donations

app.use('/api/hospital',require('./router/api/hospital.api.router'))//Hospitals

app.use('/api/user',require('./router/api/user.api.router'))//User

app.use((req,res)=>{
    res.status(404).render('404')
})