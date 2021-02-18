const User = require('../models/user')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')
const fs = require('fs')
// const cookieParser = require('cookie-parser')
const _ = require('lodash')
require('dotenv').config()
exports.signup = async (req, res) => {
    const { name, email, password } = req.body
    try {
        const foundUser = await (await User.findOne({ email }))
        if (foundUser) {
            res.json({ error: 'this email already exists.' })
        }
        const user = await new User(req.body)
        await user.save()
        res.status(200).json({ msg: 'signup success!' })
    } catch (err) {
        console.log(err)
    }
}
exports.signin = async (req, res) => {
    const { email, password } = req.body
    // find the user based on the incoming email
    const user = await User.findOne({ email })
    // if the user is not found
    if (!user) {
        res.status(401).json({ error: 'user with that email does not exist .please signup!' })
    }
    // if the user is found ,matching the password
    if (!user.authenticate(password)) {
        return res.status(401).json({
            error: 'email and password do not match !'
        })
    }
    // generate a token based on id and a secret key
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
    // persist the token as t in the token 
    res.cookie("t", token, { expire: 360000 + Date.now(), httpOnly: true })
    // return response with user and token to client in the frontend
    const { _id, name } = user
    return res.json({ token, user: { _id, name } })



}
exports.signout = (req, res) => {
    res.clearCookie("t")
    return res.json({ message: 'signout success' })
}
exports.allUsers = async (req, res) => {
    // const {name,email}=req.body
    const user = await User.find().select("name email ")
    if (!user) {
        return res.json({ error: 'no users to show' })
    }
    res.json(user)
}
exports.user = async (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}
// exports.updatedUser = async (req, res, next) => {
//     let user = req.profile
//     user = _.extend(user, req.body)
//     user.updated = Date.now()
//     let ongoing = await user.save()
//     if (!ongoing) {
//         return res.json({ error: "you are not authorized to perform it" })
//     }
//     user.hashed_password = undefined
//     user.salt = undefined
//     res.json({ user })
// }
exports.updatedUser =(req, res, next) => {
    try {
        const form = new formidable.IncomingForm()
        form.keepExtensions = true
        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({ msg: "photo could not be uploaded" })
            }
            let user = req.profile
            user = _.extend(user, fields)
            user.updated = Date.now()
            if (files.photo) {
                user.photo.data = fs.readFileSync(files.photo.path)
                user.photo.contentType = files.photo.type
            }
            console.log(user)
             user.save(err,result=>{
                 if(err){
                     return res.status(400).json({error:err})
                 }
                 user.hashed_password=undefined
                 user.salt=undefined
                 res.json(user)
                 console.log(user)
             })
             
        })
    } catch (err) {
        console.log(err)
    }
}
exports.photoHandler=(req,res,next)=>{
    if(req.profile.photo.data){
        res.set("Content-Type",req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()
}
exports.deleteUser = async (req, res) => {
    let user = req.profile
    const deletedUser = await user.remove()
    if (!deletedUser) {
        return res.json({ error: "you are not authorized" })
    }
    user.hashed_password = undefined
    user.salt = undefined
    res.json({ msg: "user is deletd successfully" })
}