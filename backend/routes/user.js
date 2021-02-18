const express=require('express')
const router=express.Router()

const {signup,signin,signout,allUsers,user,updatedUser,deleteUser,photoHandler}=require('../controllers/user')
const {runValidation}=require('../validators/index')
const {userValidate}=require('../validators/userValidator')
const {userById,requireSignin}=require('../controllers/auth')
const { cookie } = require('express-validator')

router.post('/signup',userValidate,runValidation,signup)
router.post('/signin',signin)
router.post('/signout',signout)
router.param("userid",userById)
router.get('/users',allUsers)
router.get('/user/:userid',requireSignin,user)
router.put('/user/:userid',requireSignin,updatedUser)
// creating a separate route for the send the images from the backend to the client
router.get('/user/photo/:userid',photoHandler)
router.delete('/user/:userid',requireSignin,deleteUser)

module.exports=router