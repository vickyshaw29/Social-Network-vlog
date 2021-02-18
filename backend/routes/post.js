const express=require('express')
const router=express.Router()
const {getPosts,createPost,getPostsByUser,postById,isPoster,deletePost,updatePost}=require('../controllers/post')
const {runValidation}=require('../validators/index')
const {postValidate}=require('../validators/postValidator')
const {requireSignin,userById}=require('../controllers/auth')
router.get('/post',requireSignin,getPosts)
router.post('/post/new/:userid',requireSignin,createPost)
router.get('/posts/By/:userid',getPostsByUser)
router.delete('/post/:postid',requireSignin,isPoster,deletePost)
router.put('/post/:postid',requireSignin,isPoster,updatePost)
router.param("userid",userById)
router.param("postid",postById)




module.exports=router