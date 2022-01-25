const express = require('express');
const app = express();
var PythonShell = require('python-shell');

const port = 8080;
app.listen(port, function() {
    console.log('Listening on '+port);
});

app.use(express.static(__dirname + ''));
app.use(express.json())

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
    res.sendFile(__dirname + '/data.html',{data:'this'});
});

app.get('/data/name/:name/ssn/:ssn', function(req, res) {
    ///data/name/:name/ssn/:ssn
    //req.query.country
    //req.params.country
    console.log('/data/name/:name/ssn/:ssn');
    console.log('req.query: ', req.query);
    console.log('req.query.name: ',req.query.name);
    console.log('req.query.ssn: ',req.query.ssn);
    console.log('req.params: ',req.params);
    console.log('req.params.name: ',req.params.name);
    console.log('req.params.ssn: ',req.params.ssn);
    //res.end('thank you.');

    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.params.name] 
    };
    PythonShell.PythonShell.run('dbPrac.py', options, function(err, res) {
        if(err) throw err;
        console.log('res[0]', res[0]);
        console.log('res[0][0][3]: ', res[0][0][3]);
        //res.end('res[0][0][3]');
        //res.status(200).send(res[0][0][3]);
        //res.end('res[0][0][3]');
        //console.log('res[0][0]', res[0][0]);
        //console.log('res[0][1]', res[0][1]);
        //res.render({data:res[0]});
        //res.status(200).send(res[0]);
    });
    res.end('res[0][0][3]');
    //res.status(200).send(return_value);
});

