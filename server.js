const express = require('express');
const app = express();

const calc = require('./module/calc');

//  To use python script
var PythonShell = require('python-shell');

const bodyParser = require('body-parser');
const { response } = require('express');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + ''));
app.use(express.json());

app.engine('html', require('ejs').renderFile);

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localholst:27017/UserDB';

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

app.post('/login', function(req, res) {
    console.log('/signup has been called.');
    const {id, pw, pwc} = req.body;
    console.log('id: ',id, 'pw: ',pw,'pwc: ',pwc);

    MongoClient.connect(url, function(err, db) {
        if(err) throw err;
        console.log('Mongo client connected..');
        db.close();
    }
    );
    
    /*
    if(id&&pw&&pwc) {
        if(pw!==pwc) {
            res.send('Your password and password confirmation have to be same.');
        } else {
            //Check if an ID already exists or not.
            //If not, add the account.
        }
    } else {
        res.send('Please fill out the blanks.');
    }
    */
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
    PythonShell.PythonShell.run('prePopulate.py', options, function(err, results) {
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
    PythonShell.PythonShell.run('dbShow.py', options, function(err, results) {
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
    PythonShell.PythonShell.run('dbDelete.py', options, function(err, results) {
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
    PythonShell.PythonShell.run('dbPost.py', options, function(err, results) {
        if(err) throw err;
        res.status(200).send(results[0]);
    });
});