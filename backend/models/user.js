const mongoose = require('mongoose')
var uuidv1 = require('uuidv1')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    created:{
        type:Date,
        default:Date.now()
    },
    salt: String,
    hashed_password: {
        type: String,
        required: true
    },
    updated:Date,
    photo:{
        data:Buffer,
        contentType:String
    },
    about:{
        type:String,
        trim:true
    }
})
// virtual fields
userSchema.virtual('password')
    .set(function (password) {
        // set a temporary variable _password
        this._password = password
        // prepare a salt to generate a random string
        this.salt = uuidv1()
        // encrypt the incoming pssword from the client
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })
userSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return ""
        try {
            return crypto
                .Hmac('sha256', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ""
        }
    },
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    }
}
module.exports = mongoose.model('User', userSchema)