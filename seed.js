const mongoose = require("mongoose");

const Post    = require("./models/post"),
      Comment = require("./models/comment"),
      User    = require("./models/user"),
      Favorite = require("./models/favorite");


var usersData = [
    {username: "Kathleen", password: "1qaz", species: "Kitten"},
    {username: "Margaret", password: "1qaz", species: "Lizard"},
    {username: "Sharon"  , password: "1qaz", species: "Shark"},
    {username: "Robert"  , password: "1qaz", species: "Griffin"},
    {username: "Jay"     , password: "1qaz", species: "Zebra"}
];

var postsData = [
    [
        //User 1 ---------------------------------------------//
        {
            title: "Being hated for skin",
            body: "Being hated because of the color of my skin. I’m dark skinned, 100% Italian. I was one of maybe 3 or 4 dark skinned kids at this all white upper middle class school in Long Beach, Ca. Starting in about 3rd grade, I was picked on daily, called me a stupid ugly Mexican and other such things.",
            date: new Date("2018-01-01T16:00:00Z"),
            tag: ["skin", "color", "hate"],
            meta: {
                votes: 294,
                collects: 49
            }
        },{
            title: "Both of my parents die",
            body: "I watched both of my parents die at the age of fourteen. While at school. My parents were coming into my homeroom after school for parent-teacher conferences during the spring of my sophomore year. The windows were open and I heard my parents’ voices from outside. I walked over to the window to wave at them and they waved back. Then, a delivery truck that had finished dropping things off at the cafeteria came barreling around the corner. The driver, I later found out, was extremely high on a combination of illegal drugs and didn’t even see my mother and father crossing the parking lot. He hit them at almost 50 miles per hour, much too fast for driving in a parking lot. I watched this all happen from the window and screamed when I realized that the truck wasn’t going to stop. My parents had tried to get out of the way but didn’t have enough time. They died almost instantly.",
            date: new Date("2017-01-01T16:00:00Z"),
            tag: ["parents", "childhood", "die"],
            meta: {
                votes: 347,
                collects: 23
            }
        },{
            title: "Saddened and stupid",
            body: "Today I am so saddened it's stupid. I had to call my therapist 9 times just to get the image of my FORMER best friend and Ebenezer going on a picnic out of my head.  They were my best friends. Now I want to strangle them. I don't need this bullshit, I have too much algebra homework to do to deal with that. Right now I'm listening to Bauhaus and all it's doing is making me more saddened. Ebenezer can go straight to hell without passing GO for all I care. I feel like I am completely swimming against the current, and dressed only in my punkest expression. I'm gonna IM Nikki and see if she wants to hang out at the 7-11 before I die of horror.",
            date: new Date("2016-01-01T16:00:00Z"),
            tag: ["sad"],
            meta: {
                votes: 25,
                collects: 9
            }
        },
    ],[
        //User 2 ---------------------------------------------//
        {
            title: "Heart broken",
            body: "I have faced a bad break up. I have been through the post break phase. I have faced the feelings where it seems impossible to move on from someone. It feels like our life is stuck. The person is on our mind most of the time. The fact that they don’t love you anymore will haunt you for a long time. The lump in throat will trouble you for a long time.",
            date: new Date("2018-01-02T16:00:00Z"),
            tag: ["relationship", "love"]
        },{
            title: "Sexually abused by my neighbour",
            body: "I was sexually abused by my neighbour from second to seventh standard. He tried doing that first with my sister but my brother instincts woke up and I offered myself. I didn’t know it was wrong back then. These people groom you in such a way that you don’t find anything wrong in that. I felt it is normal, whatever happening is okay. My parents used to leave me at his home. Sometimes he used to come at my house. All the time, all the time he used to touch me in the wrong way. He left Nagpur when I was in seventh standard. He still comes to our home. I hate it. I hate it from the core of my heart. I feel like killing him. I really do. I will tell my parents about it someday. I just can’t muster the courage to tell them about this. You may call me a coward.",
            date: new Date("2017-01-02T16:00:00Z"),
            tag: ["abuse", "sex", "childhood"],
            meta: {
                votes: 678,
                collects: 23
            }
        },{
            title: "Sad story",
            body: "Today I am so annoyed it's moronic. I had to masturbate 8 times just to get the image of Patti and Alan Gershowitz drinking smoothies at the mall out of my head.  They were my best friends. Now I hate them. I don't need this baloney, I have too much X-Men fanfiction to finish to deal with that. Right now I'm listening to The 'Grease' Soundtrack and all it's doing is making me more annoyed. Alan Gershowitz can go lick deez nutz for all I care. I feel like I am completely by myself, and dressed only in my black raincoat. I'm gonna IM Nikki and see if she wants to go buy some new lipgloss before I die of shock.",
            date: new Date("2016-01-02T16:00:00Z"),
            tag: ["sad"],
            meta: {
                votes: 678,
                collects: 22
            }
        },
    ],[
        //User 3 ---------------------------------------------//
        {
            title: "Bad break up",
            body: "I have faced a bad break up. I have been through the post break phase. I have faced the feelings where it seems impossible to move on from someone. It feels like our life is stuck. The person is on our mind most of the time. The fact that they don’t love you anymore will haunt you for a long time. The lump in throat will trouble you for a long time.",
            date: new Date("2018-03-04T16:00:00Z"),
            tag: ["sad"],
            meta: {
                votes: 678,
                collects: 21
            }
        },{
            title: "Today I am so rip-shit",
            body: "Today I am so ripshit it's inconceivable. I had to knock back Gatorade 7 times just to get the image of Brad and Dork Boy smoking up behind the 7-11 out of my head.  They were my best friends. Now I want to murder them. I don't need this pathetic shit, I have too much algebra homework to do to deal with that. Right now I'm listening to Twisted Sister and all it's doing is making me more ripshit. Dork Boy can go disappear forever for all I care. I feel like I am completely misunderstood, and dressed only in black, as usual. I'm gonna IM Heather F. and see if she wants to hang out before I have to call my therapist again.",
            date: new Date("2017-03-04T16:00:00Z"),
            tag: ["boring"]
        },{
            title: "Pretty sad",
            body: "Today I am so horrified it's pretty sad. I had to yell at my stupid little brother 20 times just to get the image of Eric and Alan Gershowitz doing the Macarena in Wal-Mart out of my head.  They were my best friends. Now I loathe them. I don't need this excrement, I have too much math homework to finish to deal with that. Right now I'm listening to Bauhaus and all it's doing is making me more horrified. Alan Gershowitz can go die for all I care. I feel like I am completely one against the world, and dressed only in socks. I'm gonna IM Kellie and see if she wants to play Tekken before I die of ennui.",
            date: new Date("2016-03-04T16:00:00Z"),
            tag: ["sad", "childhood"],
            meta: {
                votes: 59,
                collects: 3
            }
        }
    ],[
        //User 4 ---------------------------------------------//
        {
            title: "No one love me",
            body: "I do have friends. But they live in different cities. I have friends in college but I don’t hang out much. I hate going out. I love to sit in my room, watch netflix, watch movies, read books, play games, listen to music or just work out. I enjoy that and I prefer it over human interaction. I don't like partying. I watch most of the movies in theatre alone. My friends call me but I prefer going alone. I don’t know why this is happening. I was not like this before. But I love it. I love being alone. I have been alone for so long that now I don’t care if anyone leaves my life. I am not attached to anyone. I am not emotionally invested in anyone. I am free. I love this feeling.",
            date: new Date("2018-05-06T16:00:00Z"),
            tag: ["sad", "love"]
        },{
            title: "For all I care",
            body: "Today I am so grouchy it's retarded. I had to yell at my stupid little brother over 13 times just to get the image of Patti and Floyd talking to ALLISON 'The Bitch' BRADSHAW out of my head.  They were my best friends. Now I despise them. I don't need this cow shit, I have too much Shakespeare to read for English class to deal with that. Right now I'm listening to Sisters of Mercy and all it's doing is making me more grouchy. Floyd can go eat shit for all I care. I feel like I am completely by myself, and dressed only in black. I'm gonna IM Tracie and see if she wants to go buy some shoes before I have to jump off a bridge.",
            date: new Date("2017-05-06T16:00:00Z")
        },{
            title: "Only person love me died",
            body: "Today I am so ripshit it's almost sad. I had to yell at my stupid little brother 15 times just to get the image of my FORMER best friend and Reginald playing frisbee out of my head.  They were my best friends. Now I detest them. I don't need this pathetic shit, I have too much stuff for the Prom to buy to deal with that. Right now I'm listening to Lionel Richie and all it's doing is making me more ripshit. Reginald can go fuck off and die for all I care. I feel like I am completely in solitude, and dressed only in the underwear that Rob gave me. I'm gonna IM Micki and see if she wants to get our nails done before I am forced to eat another cheesecake.",
            date: new Date("2016-05-06T16:00:00Z")
        },
    ],[
        //User 5 ---------------------------------------------//
        {
            title: "Worst score in the world",
            body: "Yesterday, I was handed back my first college midterm, a general chemistry test that I took last Friday. I received a 74%. Now, a 74% isn’t the worst grade in the world, but as a premed, that shit is unacceptable—no medical school wants an undisciplined premed who can’t grasp “basic” science concepts. When I received my test back, I was simply in shock. Never before had I scored so low on such an important exam. To me, I had failed.",
            date: new Date("2018-07-08T16:00:00Z"),
        },{
            title: "Evil One",
            body: "Today I am so ripshit it's retarded. I had to focus on my breathing 15 times just to get the image of The Evil One and Stupid Todd sitting together in the cafeteria out of my head.  They were my best friends. Now I loathe them. I don't need this lame-ass bullcrap, I have too much meaninglessness to ponder to deal with that. Right now I'm listening to Rush and all it's doing is making me more ripshit. Stupid Todd can go jump off a bridge for all I care. I feel like I am completely alone in my struggle, and dressed only in my bleakest rags. I'm gonna IM Heather F. and see if she wants to get our nails done before I die of ennui.",
            date: new Date("2017-07-08T16:00:00Z")
        },{
            title: "Childhood trauma",
            body: "Today I am so furious it's pretty sad. I had to vacuum the living room over 13 times just to get the image of Tina and Dork Boy holding hands outside Taco Bell out of my head.  They were my best friends. Now I loathe them. I don't need this shit, I have too much meaninglessness to ponder to deal with that. Right now I'm listening to Sisters of Mercy and all it's doing is making me more furious. Dork Boy can go die for all I care. I feel like I am completely an army of One, and dressed only in black. I'm gonna IM Nikki and see if she wants to hang out at the 7-11 before I have to call my therapist again.",
            date: new Date("2016-07-08T16:00:00Z")
        },
    ]
];

function seedDB() {
    //Remove all favs

    Favorite.deleteMany({}, function (err) {
        if (err) {
            console.error(err);
        }else {
            console.log("Delete all [favs] in MongoDB.");
        }
    });


    //Remove all users
    User.deleteMany({}, function (err) {
        if (err) {
           console.error(err);
        } else {
            console.log("Delete all [users] in MongoDB.");

            //Remove all posts
            Post.deleteMany({}, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Delete all [posts] in MongoDB.");

                    //Remove all comments
                    Comment.deleteMany({}, function (err) {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("Delete all [commands] in MongoDB.");

                            //Create User
                            for (var i = 0; i < usersData.length; i++) {
                                var newUser = new User({
                                    username: usersData[i].username,
                                    species: usersData[i].species
                                });
                                var newPass = usersData[i].password;
                                //Register new user
                                (function (e) {
                                    User.register(newUser, newPass, function (err, user) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            console.log("Create new user in MongoDB:" + user.username);

                                            //Create Post
                                            // console.log(postsData[e]);
                                            postsData[e].forEach(function (ele) {
                                                Post.create(ele, function (err, post) {
                                                    if (err) {
                                                        console.error(err);
                                                    } else {
                                                        post.author.id = user._id;
                                                        post.author.authorName = user.species;
                                                        post.save();

                                                        console.log(" -- Create new Post in MongoDB:" + post.title);
                                                    }
                                                });
                                            });
                                            user.stats.posts += postsData[e].length;
                                            user.save();
                                        }
                                    });
                                })(i);
                            }
                        }
                    });
                }
            });
        }
    });
}

module.exports = seedDB;























