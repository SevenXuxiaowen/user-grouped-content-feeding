const express    = require("express"),
      bodyParser = require("body-parser"),
      methodOverride = require("method-override"),
      mongoose   = require("mongoose"),
      passport   = require("passport"),
      LocalStrategy = require("passport-local"),
      keys = require("./config/keys")

      seedDB     = require("./seed"),
      nli = require("./nli"),

      Post = require("./models/post"),
      Comment = require("./models/comment"),
      User = require("./models/user"),
      Favorite = require("./models/favorite");

const api1 = 1; // Call a outside api!!!!!

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

// console.log(keys);
mongoose.connect(keys.MONGO_URI, {useNewUrlParser: true, autoIndex: false}, ()=>{
    console.log("Successfully connect to DB");
});

// PASSPORT CONFIG =================================================== //
app.use(require("express-session")({
        secret: "Seven is coding now!",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
}); // add that middleware to every app method

// AUTH CONFIG END =================================================== //

//seedDB(); // Import some initial data to database for TEST

app.get("/", function (req, res) {
    res.redirect("/posts");
});

// ========================================================================== //
// Posts Routes
// ========================================================================== //

app.get("/posts", function (req, res) {
    Post.find({}).sort({date: -1}).exec(function (err, obj) {
        if (err) {
            console.error(err);
        }else {
            res.render("posts/posts", {obj: obj, menuId: 0});
        }
    });
});

app.get("/posts/sort/hot", function (req, res) {
    Post.find({}).sort({"meta.votes": -1, "meta.collects": -1}).exec(function (err, obj){
        if (err) {
            console.error(err);
        } else {
            res.render("posts/posts", {obj: obj, menuId: 1});
        }
    });
});

app.get("/posts/sort/recommendations", isLoggedIn, function (req, res) {
    // O(n * m) n - number of fav m - P/C_list (m < n)
    Favorite.find({userId: req.user._id}, function (err, clist) {
        if (err) {
            console.error(err);
        } else {
            var cArray = [];
            clist.forEach(function (fav) {
                cArray.push(fav.postId);
            });
            // console.log(array);
            Favorite.find({postId: {$in: cArray}}, function (err, plist) {
                if (err) {
                    console.error(err);
                }else {
                    var pArray = [];
                    plist.forEach(function (fav) {
                       if (fav.userId !== req.user._id) {
                           pArray.push(fav.userId);
                       }
                    });
                    Favorite.find({userId: {$in: pArray}}, function (err, content) {
                        if (err) {
                            console.error(err);
                        } else {
                            var postIds = [];
                            content.forEach(function (fav) {
                                if (!fav.userId.equals(req.user._id)) { //Delete P himself
                                    // console.log("push A : " + fav.userId);
                                    // console.log("push B : " + req.user._id);
                                    // console.log(fav.userId.equals(req.user._id));
                                    postIds.push(fav.postId);
                                }
                            });
                            Post.find({_id: {$in: postIds}}, function (err, obj) {
                                if (err) {
                                    console.error(err);
                                }else {
                                    res.render("posts/posts", {obj: obj, menuId: 3});
                                }
                            });

                        }
                    });
                }
            });
        }
    });
});


app.post("/posts", isLoggedIn, function (req, res) {
    Post.create(req.body.post, function (err, post) {
        if (err) {
            res.redirect("/posts/new");
        }else {
            post.author.id = req.user._id;
            post.author.authorName = req.user.species;
            post.save();

            User.findById(req.user._id, function (err, user) {
                if (err) {
                    console.error(err);
                } else {
                    user.stats.posts += 1;
                    user.save();

                    res.redirect(`/posts/${post._id}`);
                }
            });
        }
    });
});

app.get("/posts/new", isLoggedIn, function (req, res) {
    res.render("posts/addpost.ejs");
});

app.get("/posts/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, obj) {
        if (err) {
            res.redirect("/");
        }else {
            var isRed = false;
            if(req.isAuthenticated()){
                Favorite.findOne({postId: req.params.id, userId: req.user._id}, function (err, fav) {
                    if (err) {
                        console.error(err);
                    }else if (fav) {
                        isRed = true;
                    }
                    res.render("posts/show", {obj: obj, isRed: isRed});
                });
            }else {
                res.render("posts/show", {obj: obj, isRed: isRed});
            }
        }
    });
});

app.put("/posts/:id", isLoggedIn, function (req, res) {
    var newTag = req.body.tag;
    if (newTag === "") {
        res.redirect(`/posts/${req.params.id}`);
    }else {
        Post.findById(req.params.id, function (err, post) {
            if (err) {
                console.error(err);
            } else {
                post.tag.push(newTag);
                post.save();
                res.redirect(`/posts/${req.params.id}`);
            }
        });
    }
});

// ========================================================================== //
// Comment Routes
// ========================================================================== //

app.get("/posts/:id/comments/new", isLoggedIn, function (req, res) {
    Post.findById(req.params.id, function (err, obj) {
        if (err) {
            res.redirect("/posts/" + req.params.id);
        }else {
            res.render("comments/addcomment", {obj: obj});
        }
    });
});

app.post("/posts/:id/comments", isLoggedIn, function (req, res) {

    Post.findById(req.params.id, function (err, post) {
        if (err) {
            res.redirect(`/posts/${req.params.id}/comments/new`);
        }else {

            User.findById(req.user._id, function (err, user) {
                if (err) {
                    console.error(err);
                } else {
                    user.stats.comments++;
                    user.save();
                }
            });

            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    res.redirect(`/posts/${req.params.id}/comments/new`);
                }else {
                    comment.author.id = req.user._id;
                    comment.author.authorName = req.user.species;
                    comment.save();

                    post.comments.push(comment);
                    post.save();

                    res.redirect(`/posts/${req.params.id}`);
                }
            });
        }
    });
});

// ========================================================================== //
// Auth Routes
// ========================================================================== //

app.get("/register", function (req, res) {
    res.render("auth/register");
});

app.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    var newPassword = req.body.password;
    User.register(newUser, newPassword, function (err, user) {
        if (err) {
            console.error(err);
            return res.render('auth/register');
        }else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

app.get("/login", function (req, res) {
    res.render("auth/login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res){

});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// ========================================================================== //
// Dashboard Routes
// ========================================================================== //

app.get("/dashboard", isLoggedIn, function (req, res) {
    res.render('dashboard/dash_profile');
});

app.get("/dashboard/posts", isLoggedIn, function (req, res) {

    Post.find({"author" : { "authorName": req.user.species, "id": req.user._id}}, function (err, posts) {
        if (err) {
            console.error(err);
        }else {
            res.render('dashboard/dash_posts', {posts: posts});
        }
    });
});

app.get("/dashboard/collects", isLoggedIn, function (req, res) {

    Favorite.find({userId: req.user._id}, function (err, favs) {
        if (err) {
            console.error(err);
        }else {
            var ids = [];
            favs.forEach(function (ele) {
                ids.push(ele.postId);
            });
            Post.find({_id: {$in:ids}}, function (err, obj) {
                if (err) {
                    console.error(err);
                } else {
                    res.render('dashboard/dash_collects', {obj: obj});
                }
            });
        }
    });
});

app.get("/dashboard/messages", isLoggedIn, function (req, res) {
    res.render('dashboard/dash_msg');
});


// ========================================================================== //
// Search Routes
// ========================================================================== //

app.get("/search/:keyword", function (req, res) {
    var nliArray = nli(req.params.keyword); // Natural language input ...

    Post.find({$text: {$search: nliArray.join(' ')}}).exec(function (err, testSearch){
        //Text search ...
        if (err) {
            console.error(err);
        }else {
            // console.log(obj);
            Post.find({tag: {$in: nliArray}}, function (err, keyworkSearch) {
                //Keywords (tags) search ...
                if (err) {
                    console.error(err);
                }else {
                    // console.log(testSearch);
                    // console.log(keyworkSearch);
                    var result = testSearch.concat(keyworkSearch).sort(function (a, b) {
                        return b.date - a.date;
                    });
                    res.render("search", {obj: result, keywords: nliArray});
                }

            });
        }
    });
});

app.post("/search", function (req, res) {
    var keyword = req.body.keyword;
    res.redirect("/search/" + keyword);
});

// ========================================================================== //
// Favorite Routes
// ========================================================================== //

app.post("/favorite/:id", isLoggedIn, function (req, res) {
    Favorite.create({}, function (err, fav) {
        if (err) {
            console.error(err);
        } else {
            fav.postId = req.params.id;
            fav.userId = req.user._id;
            fav.save();

            User.findById(req.user._id, function (err, user) {
                if (err) {
                    console.error(err);
                } else {
                    user.stats.collects++;
                    user.save();
                }
            });

            Post.findById(req.params.id, function (err, post) {
                if (err) {
                    console.error(err);
                }else {
                    post.meta.collects += 1;
                    post.save();

                    res.redirect(`/posts/${req.params.id}`);
                }
            });
        }
    });

});

app.delete("/favorite/:id", isLoggedIn, function (req, res) {
    Favorite.deleteOne({postId: req.params.id, userId: req.user._id}, function (err) {
        if (err) {
            console.error(err);
        } else {

            User.findById(req.user._id, function (err, user) {
                if (err) {
                    console.error(err);
                } else {
                    user.stats.collects--;
                    user.save();
                }
            });
            
            Post.findById(req.params.id, function (err, post) {
                if (err) {
                    console.error(err);
                } else {
                    post.meta.collects -= 1;
                    post.save();

                    res.redirect(`/posts/${req.params.id}`);
                }
            });
        }
    });
});

// ========================================================================== //
// Vote Routes
// ========================================================================== //
app.post("/vote/:id", isLoggedIn, function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (err) {
            console.error(err);
        } else {
            post.meta.votes++;
            post.save();

            res.redirect(`/posts/${req.params.id}`);
        }
    });
});

// ========================================================================== //
// Middleware
// ========================================================================== //

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
		console.log(`app is listening to ${PORT}`);
});