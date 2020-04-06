const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,

    species: {type: String, default: "Lonely Cat"},

    stats: {
        posts: {type: Number, default: 0},
        collects: {type: Number, default: 0},
        comments: {type: Number, default: 0}
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);