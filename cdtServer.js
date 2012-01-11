var express = require('express');
var url = require('url');
var app = express.createServer();
var cdt = require('./cdt');

app.use(express.logger());

app.get('/createMachine', function(req, res){
    var _url = url.parse(req.url,true);
    var paramObject = _url.query;
    
    if((paramObject.hasOwnProperty("name")&&paramObject.hasOwnProperty("size"))){
	var param1 = _url.query["name"];
	var param2 = _url.query["size"];
	cdt.nodeDeployment(param1,param2,res);
    }else{
	res.writeHead(400,{'Content-Type':'text/plain'});
	res.end("Insufficient or Wrong Parameters\n");
    }
});

app.listen(80);