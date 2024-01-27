const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/paytmApp");

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50
    },
    password: {
        type: String,
        require: true,
        lowercase: true,
        minLength: 8,
    },
    firstName: {
        type: String,
        require: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        require: true,
        trim: true,
        maxLength: 50
    }
})

const AccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }, 
    balance: {
        type: Number,
        require: true
    }
}) 


const Account = mongoose.model('Accounts', AccountSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
    Account
}