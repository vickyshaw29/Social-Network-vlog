const Post = require('../models/post')
const formidable = require('formidable')
const fs = require('fs')
const user = require('../models/user')
const _=require('lodash')
// making a post profile
exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate("postedBy", "_id,name")
        .exec((err, post) => {
            if (err || !post) {
                res.status(403).json({ error: "user not found" })
            }
            req.post=post
            next()
        })
}

exports.getPosts = async (req, res) => {
    const posts = await Post.find()
    res.json(posts)
}
exports.createPost = async (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "image could not be uploaded" })
        }
        let post = new Post(fields)
        req.profile.hashed_password = undefined
        req.profile.salt = undefined
        post.postedBy = req.profile
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path)
            post.photo.contentType = files.photo.type
        }
        await post.save()
        res.json({ post })
    })





    try {
        const post = new Post(req.body)
        await post.save()
        res.json({ msg: "psot created" })

    } catch (err) {
        console.log(err)
    }
}
exports.getPostsByUser = (req, res) => {
    Post.find({ postedBy: req.profile })
        .populate("name _id")
        .sort("_created")
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({ error: "user has not posted yet" })
            }
            res.json(posts)
        })
}
// 
exports.isPoster=(req,res,next)=>{
    let isPoster=req.post && req.auth && req.post.postedBy._id == req.auth._id
    console.log(req.post)
    console.log(req.auth)
    // console.log(req.post.postedBy._id)
    // console.log(req.auth._id)
    if(!isPoster){
        res.status(400).json({
            error:"user not authenticated"
        })
    }
    next()
}
// applying an update logic for any particular posts
exports.updatePost=(req,res)=>{
    let post=req.post
    post=_.extend(post,req.body)
    post.updated=Date.now()
    post.save(err=>{
        if(err){
            res.status(400).json({error:"user not authorized"})
        }
        res.json({msg:"updated successfully"})
    })

}
exports.deletePost=(req,res)=>{
    let post=req.post
    post.remove((err,post)=>{
        if(err || !post){
            res.json({error:"could not delete post"})
        }
        res.json({msg:"deleted successfully"})
    })
}
