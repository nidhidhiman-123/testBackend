const mongoose = require("mongoose");
const { APP_URL } = require("../config");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    post_date: { type: Date },
    image: {
        type: String, default: '', get: (image) => {
            return `${APP_URL} /${image}`;
        }
    },
    like: [
        { type: Schema.Types.ObjectId, ref: 'NewUser' }
    ],
    comment: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Comment'
        }
    ]
}, { timestamps: true, toJSON: { getters: true } });

export default mongoose.model('Post', postSchema, 'post')