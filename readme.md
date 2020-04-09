# Trauma Forest
Creator: Xiaowen Xu | Andrew Id: xiaowenx <br> Enterprise Web Development (CMU 96-882) Demo(v1).

## Description
I create this website to decrease the anxiety of people who have mental hurt in modern society.
A website that can collect users' trauma stories to the 'tree holes'. Let other users to comment and collect those tree holes. With so many trauma tree holes, this website is called 'Trauma Forest'. 

## Env Setting
1. Install `node.js`
2. Install `npm`
3. Install `MongoDB`

## How to run my demo
1. If you're a Mac, run `mongod` in terminal first.
2. Open another terminal, go to project folder, type in `npm run dev` ( or `node app.js`) and run it.
3. Open browser, type in `http://localhost:3000`. 
4. Go to `app.js:47,` comment this line `seedDB();`This function is to import some initial data to demo project. Since you have already initialized, don't run it again.
4. Enjoy my demo!

## Fake accounts
In order to present the demo smoothly, I registered some account in advance. You can use those account to login. Of course, you can also register your own account.

1. username:`Kathleen`  password: `1qaz`
2. username:`Margaret`  password: `1qaz`
3. username:`Sharon`  password: `1qaz`
4. username:`Robert`  password: `1qaz`
5. username:`Jay`  password: `1qaz`

## How do I complete the tasks
#### 1. Login/Signup +10pts
Use passport, passport-local, passport-local-mongoose library. 
See `app.js:246`
`/models/user.js`
#### 2. Submit AND Read content +15pts
Sort posts by time, by hottest and recommendation (if logged in). 
See `app.js:57`
`/models/post.js`
#### 3. Search for content and display +15pts
*Be sure to have an answer about how you sort the results.*<br>
See `app.js:246`
#### 4. Home page WITH Immediate Immersion (aka Lazy Signup) +5pts
See `app.js:447`
#### 5. Badges OR Notifications OR Dashboard +5pts
See `app.js:285`
#### 6. Vote to Promote +5pts
*Remember that it modifies Search sort results*<br>
See `app.js:230`
#### 7. Favorites +5pts
*Be sure to show how it also modifies Search sort results*<br>
See `app.js:366`
`/models/favorite.js`
#### 8. Tagging (in general or of favorites) +5pts
*Show how it expands the Search results*<br>
*Tags are entered by OTHER users, not the person doing the post*<br>
See `app.js:366`
#### 9. Natural Language Interface to Search +5pts
*If implemented on front end +2!*<br>
See `app.js:330`
`nli.js`
#### 10. Suggestions +5pts
*EITHER related content OR recommendations*<br>
*Show your external program and how it works.*<br>
See `app.js:77`

