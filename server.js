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

app.get('/result', function(req, res) {
    
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
        //res.status(200).send(results);
    });
    
    res.sendFile(__dirname + '/result.html');
});


//http://localhost:8080/result/country/au
app.get('/result/country/:country?', function(req, res) {
    //req.query.country
    //req.params.country
    let return_value = '';
    var options = {
        mode: 'json',
        pythonPath:'',  
        pythonOptions:['-u'],
        scriptPath:'',
        args: [req.params.country]
    };
    console.log(req.params.country);
    PythonShell.PythonShell.run('test.py', options, function(err, results) {
        if(err) throw err;
        //console.log('return: ', results);
        res.status(200).send(results[0]);
    });
});
