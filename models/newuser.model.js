const mongoose = require("mongoose");
const { APP_URL } = require("../config");
const Schema = mongoose.Schema;

const newuserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    phonenumber: { type: String, required: true },
    dob: { type: Date, required: true },
    designation: { type: String, required: true },
    date_of_joining: { type: String, required: true },
    emp_id: { type: String, required: true },
    role: { type: Intl, default: 0 },
    first_login: { type: String, default: '' },
    leave: {
        casual_leave: { type: Intl, default: 0.5 },
        sick_leave: { type: Intl, default: 0.5 },
    },
    image: {
        type: String, get: (image) => {
            return `${APP_URL}/${image}`;
        }
    },
    invite_status: { type: String, default: false }
}, { timestamps: true, toJSON: { getters: true } });

module.exports = mongoose.model('NewUser', newuserSchema, 'newuser')