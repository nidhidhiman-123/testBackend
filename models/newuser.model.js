const mongoose = require("mongoose");
const { APP_URL } = require("../config");
const Schema = mongoose.Schema;

const newuserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: true },
    dob: { type: Date, required: true },
    designation: { type: String, required: true },
    date_of_joining: { type: String, required: true },
    emp_id: { type: String, required: true },
    role: { type: Intl, default: 0 },
    image: {
        type: String, get: (image) => {
            return `${APP_URL} /${image}`;
        }
    },

}, { timestamps: true, toJSON: { getters: true } });

module.exports = mongoose.model('NewUser', newuserSchema, 'newuser')