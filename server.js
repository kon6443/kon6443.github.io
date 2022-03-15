const express = require('express');
const app = express();

require('dotenv').config(); // calling enviroment variable from .env file

// connecting Mongoose
const mongoose = require('mongoose');
// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

const User = require('./module/user');
const { auth } = require('./module/authMiddleware');


//  To use python script
var PythonShell = require('python-shell');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + ''));

// allow us to get teh data in request.body;
app.use(express.json());

app.engine('html', require('ejs').renderFile);

const port = 8080;
app.listen(port, function() {
    console.log('Listening on '+port);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
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

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login/:signInid/:signInpw', function(req, res, next) {
    let user = new User(req.body);
    User.findOne({id:(user.id)}, function(err, docs) {
        if(err) throw err;
        else if(docs == null) { // Entered ID does not exist.
            res.send('Entered ID does not exist.');
        }
        else {  // when entered ID matches.
            if(user.pw===docs.pw) { 
                const payload = { // put data into json web token
                    docs,
                };
                // generating json web token and sending it
                jwt.sign(
                payload, // data into payload
                process.env.SECRET_KEY, // secret key value
                { expiresIn: "1h" }, // token expiration time
                (err, token) => {
                    if (err) throw err;
                    else {
                        res.cookie('user', token);
                        next();
                    }
                });
            } else res.send('Your password does not match with your ID.');
        }
    });
});

app.post('/login/:signInid/:signInpw', auth, function(req, res) {
    const user = req.decoded.docs;
    return res.status(200).json({
        code: 200,
        message: 'Token is valid.',
        data: {
          user: user
        }
    });
});

app.post('/login/:signUpid/:signUpaddress/:signUppw/:signUppwc', function(req, res) {
    let user = new User(req.body);
    User.findOne({id:(user.id)}, function(err, docs) {
        if(err) throw err;
        else if(docs == null) { // Entered ID is available.
            if(user.id&&user.pw&&user.pwc) {
                if(user.pw!==user.pwc) {// password and password confirmation are not the same.
                    res.send('Your password and password confirmation have to be same.');
                } else {    // adding a new account.
                    console.log('user: ', user);
                    user.save();
                    res.send('pw and pwc matches. Start to save account informaton.');
                }
            } else res.send('Please enter all the blanks.');
        }
        else {
            res.send('Your entered ID already exists.');
        }
    });    
});

mongoose.connect(
    process.env.MONGO_URI,
    {
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB conected..'))
  .catch((err) => {
    console.log(err);
});


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