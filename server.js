const express = require('express');
const app = express();
var PythonShell = require('python-shell');

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + ''));
app.use(express.json());

const port = 8080;
app.listen(port, function() {
    console.log('Listening on '+port);
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/image', function(req, res) {
    res.sendFile(__dirname + '/image.html');
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

app.post('/data', function(req, res) {
    const {name, ssn, state} = req.body;
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [name,ssn,state]
    };
    console.log("options['args'][0]: ", options['args'][0]);
    console.log("options['args'][1]: ", options['args'][1]);
    console.log("options['args'][2]: ", options['args'][2]);
    PythonShell.PythonShell.run('dbPrac.py', options, function(err, res) {
        if(err) throw err;
        console.log('res[0][0]: ', res[0][0]);
        //console.log('res[0][0][3]: ', res[0][0][3]);
    });
    res.json(req.body);
});