const User=require('../models/user')
require('dotenv').config()
const expressJwt=require('express-jwt')
exports.requireSignin=expressJwt({
    secret:  process.env.SECRET_KEY, algorithms: ['HS256'] ,
    userProperty:'auth'
})
exports.userById=async(req,res,next,id)=>{
    const user=await User.findById(id)
    if(!user){
        return res.status(400).json({error:"user not found"})
    }
    // adding a profile object in the user obejct
    req.profile=user
    next();
}
exports.hasAuthorized=(req,res,next)=>{
    const authorized=req.profile && req.auth &&req.profile._id==req.auth._id
    if(!auhorized){
        return res.status(403).json({error:"user not authorized"})
    }
    next();
}
