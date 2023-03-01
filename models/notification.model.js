const mongoose = require("mongoose");
const { APP_URL } = require("../config");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    type: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'NewUser' },
    is_read: { type: Boolean, default: false },
    leave_id: { type: Schema.Types.ObjectId, ref: 'Apply_leave' },



}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema, 'notification')