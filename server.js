const express = require('express');
const app = express();

//  To use python script
var PythonShell = require('python-shell');

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + ''));
app.use(express.json());

app.engine('html', require('ejs').renderFile);

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

/*
app.get('/data', function(req, res) {
    
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: []
    };
    PythonShell.PythonShell.run('dbShow.py', options, function(err, res, next) {
        if(err) throw err;
        console.log('res[0]: ', res[0]);
        var name = res[0];
        res.status(200).json({name: JSON.parse(res[0])});
        //next();
    });
    //res.sendFile(__dirname + '/data.html',{name:name});
    //var name = 'whut up';
    //res.render(__dirname + '/data.html',{name:name});
    res.render(__dirname + '/data.html');
});
*/

app.get('/data', function(req, res) {
    res.sendFile(__dirname + '/data.html');
});


/*
app.get('/data', function(req, res) {
    console.log('/data is on.');
    const runPy = async (code) => {
        var options = { 
            mode: 'json',
            pythonPath:'',  
            pythonOptions:['-u'],
            scriptPath:'',
            args: []
        };
       // wrap it in a promise, and `await` the result
       const result = await new Promise((resolve, reject) => {
         PythonShell.run('dbShow.py', options, (err, res) => {
           if (err) return reject(err);
           console.log('dbShow executed.');
           return resolve(res);
         });
       });
       console.log(res.stdout);
       return result;
     };
    //console.log('This is a result: ', result);
    res.sendFile(__dirname + '/data.html');
});
*/


app.post('/data', function(req, res) {
    const {name, ssn, state} = req.body;
    console.log('name: ',name, 'ssn: ',ssn,'state: ',state);
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [name,ssn,state]
    };
    PythonShell.PythonShell.run('dbPrac.py', options, function(err, results) {
        if(err) throw err;
        console.log(results[0][0]);
        res.status(200).send(results[0]);
    });
});