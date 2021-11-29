const express = require('express');
const app = express();
var PythonShell = require('python-shell');

const port = 8080;
app.listen(port, function() {
    console.log('Listening on '+port);
});

app.use(express.static(__dirname + ''));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/image', function(req, res) {
    res.sendFile(__dirname + '/image.html');
});

app.get('/result', function(req, res) {
    res.sendFile(__dirname + '/result.html');
});

app.get('/data', function(req, res) {
    res.sendFile(__dirname + '/data.html');
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

app.post('/image/:filename&:blurfactor', function(req, res) {
    var options = {
        mode: 'text',
        pythonPath:'',  
        pythonOptions:['-u'],  
        scriptPath:'',
        //args: ['cat', '1']
        args: [req.params.filename, req.params.blurfactor]
    };
    console.log('params.filename: ', req.params.filename);
    console.log('params.blurfactor: ', req.params.blurfactor);
    PythonShell.PythonShell.run('blur.py', options, function(err, results) {
        if(err) throw err;
        res.status(200).send(results[0]);
    });
});