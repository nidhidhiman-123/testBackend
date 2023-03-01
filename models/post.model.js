const mongoose = require("mongoose");
const { APP_URL } = require("../config");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    post_date: { type: Date },
    image: {
        type: String, default: ''},
    like: [
        { type: Schema.Types.ObjectId, ref: 'NewUser' }
    ],
    comment: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'NewUser' },
            content: { type: String }
        }
    ]
}, { timestamps: true, toJSON: { getters: true } });

module.exports = mongoose.model('Post', postSchema, 'post')