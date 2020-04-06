const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    body: String,
    date:   { type: Date, default: Date.now },

    joyScore: { type: Number, default: 0 },

    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        authorName: String
    },
});

module.exports = mongoose.model("Comment", commentSchema);