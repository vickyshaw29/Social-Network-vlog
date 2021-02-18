const express=require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const postRoute=require('./routes/post')
const userRoute=require('./routes/user')
require('dotenv').config()
// app
const app=express()
// middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))
if(process.env.NODE_ENV=='development'){
    app.use(cors({origin:`${process.env.CLIENT_URL}`}))
}
// routing middlewares
app.use('/api',postRoute)
app.use('/api',userRoute)
app.use(function(err,req,res,next){
    if(err.name=='UnauthorizedError'){
        res.status(401).json({err:'User not authorized'})
    }
})
// db
mongoose.connect(process.env.MONGODB_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(process.env.PORT,()=>console.log('running on port 8000')))
.catch(err=>console.log(err))