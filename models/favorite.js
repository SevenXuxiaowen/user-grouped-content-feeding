const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = new mongoose.model("Favorite", favoriteSchema);
