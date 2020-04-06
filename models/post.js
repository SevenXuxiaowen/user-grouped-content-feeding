const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:  { type: String, default: "No Title Hole" },
    body:   String,
    date:   { type: Date, default: Date.now },
    hidden: { type: Boolean, default: true },

    traumaScore: { type: Number, default: 0},

    meta: {
        votes: { type: Number, default: 0},
        collects:  { type: Number, default: 0},
    },

    // Data Association
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        authorName: String
    },

    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],

    tag: [
        {type: String}
    ]

});

postSchema.index({ "title": "text", "body": "text", "tag": "text" });
postSchema.index({tag: 1});

module.exports = mongoose.model("Post", postSchema);

