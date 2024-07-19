const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['admin', 'user','premium'],
        default: 'user'
    },
    passwordToken:{
        token:String,
        expires: Date
    }, documents: [
        {
            name: {
                type: String,
                required: true,
            },
            reference: {
                type: String,
                required: true,
            },
        },
    ], last_connection: {
        type: Date,
    },
}, {
    timestamps: true,

    

});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;