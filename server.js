const express = require('express');
const app = express();

// connecting Mongoose
const mongoose = require('mongoose');

const User = require('./module/user');
require('dotenv').config(); // calling enviroment variable from .env file

//  To use python script
var PythonShell = require('python-shell');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + ''));

// allow us to get teh data in request.body;
app.use(express.json());

app.engine('html', require('ejs').renderFile);

// Using jsonwebtoken module.
const jwt = require("jsonwebtoken");

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

app.post('/login/:signInid/:signInpw', function(req, res) {
    let user = new User(req.body);
    User.findOne({id:(user.id)}, function(err, docs) {
        if(err) throw err;
        else if(docs == null) { // Entered ID does not exist.
            res.send('Entered ID does not exist.');
        }
        else {  // Entered ID matches.
            if(user.pw===docs.pw) {

                const payload = { // json web token 으로 변환할 데이터 정보
                    user,
                };
                // json web token 생성하여 send 해주기
                jwt.sign(
                payload, // 변환할 데이터
                process.env.SECRET_KEY, // secret key 값
                { expiresIn: "1h" }, // token의 유효시간
                (err, token) => {    
                    if (err) throw err;
                    res.send({ token }); // token 값 response 해주기
                }
                );
                
                // Verify token
                try {
                    // token 해독, token을 만들 때 설정한 secret key 값 : jwtSecret
                    const decoded = jwt.verify(token, process.env.SECRET_KEY);
                    // req에 해독한 user 정보 생성 
                    req.user = decoded.user;
                    next();
                } catch (error) {
                    res.status(401).json({ msg: "Token is not valid" });
                }



            } else res.send('Your password does not match with your ID.');
        }
    });
});

app.post('/login/:signUpid/:signUppw/:signUppwc', function(req, res) {
    let user = new User(req.body);
    User.findOne({id:(user.id)}, function(err, docs) {
        if(err) throw err;
        else if(docs == null) { // Entered ID is available.
            if(user.id&&user.pw&&user.pwc) {
                if(user.pw!==user.pwc) {// password and password confirmation are not the same.
                    res.send('Your password and password confirmation have to be same.');
                } else {    // adding a new account.
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