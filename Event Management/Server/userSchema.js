const mongoose = require('mongoose');
const { findOne } = require('./eventSchema');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: String
});

userSchema.statics.isThisEmailInUse = async function (email) {
    if(!email) throw new Error("Invalid Email")

    try {
        const user = await this.findOne({email})

        if(user) return false

        return true;
    } catch (error) {
        console.log(error.message)

        return false
    }
}

const userModel = mongoose.model('userModel', userSchema, 'user');


module.exports = userModel;