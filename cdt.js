var nodeDeployment = function(name,machineSize,res){
    var fs = require('fs');
    var util = require('util');
    var crypto = require('crypto');
    var sprintf = require('sprintf').sprintf;
    var restify = require('restify');
    
    var alg = 'RSA-SHA256';
    var now = restify.httpDate();
    var signer = crypto.createSign(alg);
    var home = process.env.HOME;
    var key = fs.readFileSync(home + '/.ssh/id_rsa', 'ascii');
    var SIGNATURE = 'Signature keyId="%s",algorithm="%s" %s';
    var keyId = '/syndev/keys/neeleshbafna';
    
    var body = { 'name': name,
		 'package':machineSize,
	       };
    
    signer.update(now);

    var options= {
	host: 'us-west-1.api.joyentcloud.com',
	path: '/my/machines',
	method: 'POST',
	headers: {
	    'content-type': 'application/json',
	    'X-Api-Version': '~6.5',
	    'Authorization': sprintf(SIGNATURE,keyId,'rsa-sha256',signer.sign(key,'base64')),
	    'Date': now
	}
    };
    var req = require('https').request(options);
    req.write(JSON.stringify(body));
    req.end();
    
    req.on('response', function (response) {
	console.log('STATUS: ' + response.statusCode);
	response.setEncoding('utf8');
	response.on('data', function (data) {
	    var id = JSON.parse(data).id;
	    console.log('BODY: ' + data);
	    res.write(data+'\n',encoding='utf-8');
	});
    });
}
exports.nodeDeployment = nodeDeployment;

