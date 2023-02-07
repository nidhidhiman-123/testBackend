const mongoose = require("mongoose");
const { APP_URL } = require("../config");
const Schema = mongoose.Schema;

const leavesSchema = new Schema({


    name: { type: String },
    leave_type: { type: String },


}, { timestamps: true });

export default mongoose.model('Leaves', leavesSchema, 'leaves')