const express = require('express');
const app = express();
var PythonShell = require('python-shell');

const port = 8080;
app.listen(port, function() {
    console.log('Listening on '+port);
});

app.use(express.static(__dirname + ''));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/home.html');
});

app.get('/blur', function(req, res) {
    res.sendFile(__dirname + '/blur.html');
});

app.get('/search', function(req, res) {
    /*
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.query.country]
    };
    PythonShell.PythonShell.run('test.py', options, function(err, results, next) {
        if(err) throw err;
        console.log('return: ', results);
        return results;
    });
    */
    res.sendFile(__dirname + '/search.html');
});

app.get('/search/:country', function(req, res) {
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.query.country]
    };
    PythonShell.PythonShell.run('test.py', options, function(err, results, next) {
        if(err) throw err;
        console.log('return: ', results);
        return results;
    });
    res.sendFile(__dirname + '/search.html');
});
