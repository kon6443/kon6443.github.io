const express = require('express');
const app = express();
const port = 8080;
var PythonShell = require('python-shell');

app.listen(port, function() {
    console.log('Listening on 8080.');
});

app.get('/first', function(req, res) {
    res.send('first');
});

app.get('/', function(req, res) {
    //console.log('req.query.country:', req.query.country);
    var options = {
        mode: 'text',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.query.country]  
    };
    PythonShell.PythonShell.run('test.py', options, function(err, results) {
        if(err) throw err;
        console.log('results: ', results);  
        console.log('results[0]: ', results[0]);
    });
    res.sendFile(__dirname + '/search.html', {country:'au'});
});

