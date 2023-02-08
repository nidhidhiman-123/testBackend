const mongoose = require("mongoose");
const { APP_URL } = require("../config");

const Schema = mongoose.Schema;

const applyleaveSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'NewUser' },

    leave: { type: Schema.Types.ObjectId, ref: 'Leaves', required: true },
    status: { type: String, default: "pending" },
    from_date: { type: String, required: true },
    to_date: { type: String, required: true },
    reason: { type: String, required: true },



})


module.exports = mongoose.model('Apply_leave', applyleaveSchema, 'apply_leave');