const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: String,
    date: String,
    time: String,
    location: String,
    completion: String,
});

eventSchema.statics.isThisEmailInUse = async function (eventName) {
    if(!eventName) throw new Error("Invalid Email")

    try {
        const user = await this.findOne({eventName})

        if(user) return false

        return true;
    } catch (error) {
        console.log(error.message)

        return false
    }
}

const eventModel = mongoose.model('eventModel', eventSchema, 'event');
module.exports = eventModel;