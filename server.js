const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config(); // calling enviroment variable from .env file

// connecting Mongoose
//const mongoose = require('mongoose');
// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

const User = require('./module/user');
const { auth } = require('./module/authMiddleware');
const { db } = require('./module/db');

const bcrypt = require('bcrypt');
const saltRounds = 10;

//  To use python script
var PythonShell = require('python-shell');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + ''));

// allow us to get teh data in request.body;
app.use(express.json());

app.set('view engine', 'ejs');  

db();

const port = 8080;
app.listen(port, function() {
    console.log('Listening on '+port);
});

app.get('/', auth, function(req, res) {
    const user = req.decoded;
    if(user) {
        return res.render('index', {user:user.docs});
    } else {
        return res.sendFile(__dirname + '/home.html');
    }
});

app.get('/dev', function(req, res) {
    res.sendFile(__dirname + '/dev.html');
});

app.get('/private', function(req, res) {
    res.sendFile(__dirname + '/private.html');
});

app.get('/about', function(req, res) {
    res.sendFile(__dirname + '/about.html');
});

app.get('/login', auth, function(req, res) {
    const user = req.decoded;
    if(user) {
        return res.render('loggedin', {user:user.docs});
    } else {
        return res.sendFile(__dirname + '/login.html');
    }
});

app.get('/logOut', function(req, res) {
    return res.clearCookie('user').end();
});

app.post('/login/:signInid/:signInpw', function(req, res, next) {
    let user = new User(req.body);
    User.findOne({id:(user.id)}, function(err, docs) {
        if(err) throw err;
        else if(docs == null) { // Entered ID does not exist.
            return console.log('Entered ID does not exist.');
        } else {  // when entered ID matches.
            bcrypt.compare(user.pw, docs.pw, function (err, answer) {
                if (err) throw err;
                if(answer) {
                    req.user = docs;
                    return next();
                } else {
                    return res.send('Your password does not match with your ID.');
                }
            })
        }
    });
});
app.post('/login/:signInid/:signInpw', function(req, res) {
    const docs = req.user;
    const payload = { // put data into json web token
        docs,
    };
    // generating json web token and sending it
    jwt.sign(
    payload, // data into payload
    process.env.SECRET_KEY, // secret key value
    { expiresIn: "30m" }, // token expiration time
    (err, token) => {
        if (err) throw err;
        else {
            return res
            .cookie('user', token,{maxAge:30*60 * 1000})
            .end();
        }
    });
});

app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res, next) {
    let user = new User(req.body);
    if(user.pw!==user.pwc) {
        return res.send('Your password and password confirmation have to be same.');
    }
    User.findOne({id:(user.id)}, function(err, docs) {
        if(err) throw err;
        else if(docs == null) { // Entered ID is available.
            if(user.id&&user.pw&&user.pwc) {    // adding a new account.
                return next();
            } else return res.send('Please enter all the blanks.');
        }
        else {
            return res.send('Your entered ID already exists.');
        }
    });
});

app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
    let user = new User(req.body);
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) throw err;
        bcrypt.hash(user.pw, salt, function (err, hash) {
            if (err) throw err;
            user.pw = hash;
            user.save();
            return res.send('You have just created your new account!');
        })
    })
});

// app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res, next) {
//     let user = new User(req.body);
//     if(user.pw!==user.pwc) {
//         return res.send('Your password and password confirmation have to be same.');
//     }
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//         if (err) throw err;
//         bcrypt.hash(req.body.pw, salt, function (err, hash) {
//             if (err) throw err;
//             req.hash = hash
//             return next()
//         })
//     })
// });

// app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
//     let user = new User(req.body);
//     user.pw = req.hash;
//     User.findOne({id:(user.id)}, function(err, docs) {
//         if(err) throw err;
//         else if(docs == null) { // Entered ID is available.
//             if(user.id&&user.pw&&user.pwc) {    // adding a new account.
//                 user.save();
//                 return res.send('You have just created your new account!');
//             } else return res.send('Please enter all the blanks.');
//         }
//         else {
//             return res.send('Your entered ID already exists.');
//         }
//     });    
// });

app.get('/result', function(req, res) {
    res.sendFile(__dirname + '/result.html');
});

app.get('/result/country/:country', function(req, res) {
    //req.query.country
    //req.params.country
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.query.country]
    };
    PythonShell.PythonShell.run('./pythonScript/prePopulate.py', options, function(err, results) {
        if(err) throw err;
        res.status(200).send(results[0]);
    });
});

app.get('/data', function(req, res) {
    res.sendFile(__dirname + '/data.html');
});

app.get('/data/:name/:ssn/:state', function(req, res) {
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: []
    };
    PythonShell.PythonShell.run('./pythonScript/dbShow.py', options, function(err, results) {
        if(err) throw err;
        const headings = ['id','Name','SSN','State'];
        res.status(200).send({headings:headings,data:results[0]});
    });
});

app.delete('/data/:id', function(req, res) {
    const {id} = req.body;
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [id]
    };
    PythonShell.PythonShell.run('./pythonScript/dbDelete.py', options, function(err, results) {
        if(err) throw err;
        res.status(200).send(results[0]);
    });
});

app.post('/data', function(req, res) {
    const {name, ssn, state} = req.body;
    var options = {
        mode: 'json',
        pythonPath:'',
        pythonOptions:['-u'],
        scriptPath:'',
        args: [name,ssn,state]
    };
    PythonShell.PythonShell.run('./pythonScript/dbPost.py', options, function(err, results) {
        if(err) throw err;
        res.status(200).send(results[0]);
    });
});