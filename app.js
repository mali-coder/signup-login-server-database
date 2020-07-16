const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");

var isdatabase = false;

mongoose.connect('mongodb://localhost/parking-case', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        isdatabase = true;
    }
    else {
        isdatabase = false;
    }


});
let db = mongoose.connection;

const varSchema = new mongoose.Schema({
    userCount: {
        type: Number
    }
});

let userCount = 0;

var Count = mongoose.model('variable', varSchema);

const UserSchema = new mongoose.Schema({
    user_id: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

// let user1 = new User({user_id: 1, name: 'ansari', email: 'abc_123@email.com', password: 'abc123'});
// let user2 = new User({user_id: 2, name: 'ali', email: 'def_456@email.com', password: 'def456'});
// let user3 = new User({user_id: 3, name: 'maaz', email: 'ghi_789@email.com', password: 'ghi789'});

// user1.save().then(()=>{
//     console.log(`${user1.name} saved to database!!`);
// }).catch(()=>{
//     console.log(`${user1.name} cant be saved to database`);
// });
// user2.save().then(()=>{
//     console.log(`${user2.name} saved to database!!`);
// }).catch(()=>{
//     console.log(`${user2.name} cant be saved to database`);
// });
// user3.save().then(()=>{
//     console.log(`${user3.name} saved to database!!`);
// }).catch(()=>{
//     console.log(`${user3.name} cant be saved to database`);
// });

// console.log(user1);

// User.find({}, (err, users)=>{
//     if(err) return console.error(err);
//     for(let i = 0 ; i < users.length ; i++){
//         console.log(`iteration : ${i}`);
//         if(users[i].name === 'ansari'){
//             console.log(`${users[i].name} present with id : ${users[i].user_id}`);
//             break;
//         } 
//     }
// });

let app = express();

app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.json());

app.set('view engine', 'pug');
app.set("views", path.join(__dirname, "views"))


app.get('/', (req, res) => {
    res.status(200).render('home');
});

app.get('/login-page', (req, res) => {
    res.status(200).render('acc-success');
});

app.get('/bookings', (req, res) => {
    res.status(200).render('bookings');
});

app.post('/login', (req, res) => {
    if (!isdatabase) return res.json({ status : { email: false, password: false, db: false }, data : { user_id : null, name: null, email: null, password: null}});
    User.find({}, (err, users) => {
        if (err)  return res.json({ status : { email: false, password: false, db: false }, data : { user_id : null, name: null, email: null, password: null}});
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === req.body.email) {
                if(users[i].password === req.body.password){
                    return res.json({ status : { email: true, password: true, db: true }, data : { user_id : users[i].user_id, name: users[i].name, email: users[i].email, password: users[i].password}});
                }else{     
                    return res.json({ status : { email: true, password: false, db: true }, data : { user_id : null, name: null, email: null, password: null}});
                }
            }
        }
        return res.json({ status : { email: false, password: false, db: true }, data : { user_id : null, name: null, email: null, password: null}});
    });
});

app.post('/signup', (req, res) => {
    if (!isdatabase) res.json({ email: false, db: false });
    User.find({}, (err, users) => {
        if (err) res.json({ email: false, db: false });
        for (let i = 0; i < users.length; i++) {
            // console.log(users[i].email + ' ' + req.body.email);
            if (users[i].email === req.body.email) {
                return res.json({ email: false, db: true });
            }
        }
        let user = new User({ user_id: ++userCount, name: req.body.name, email: req.body.email, password: req.body.password });
    
        user.save()
            .then(() => res.json({ email: true, db: true }))
            .catch(() => res.json({ email: true, db: false }));
    });
    
});


app.listen(80, () => {
    console.log("You are listening to port 80");
})