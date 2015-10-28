"use strict";

var https = require('https');
var lineReader = require('line-reader');

class CertificateChainManager {
	static getCAs(filePath,cb) {
		var ca = [],
		    cert = [];
		lineReader.eachLine(filePath, function(line, last) {
			if(line.length>0) {
                                cert.push(line);
                                if(line.match(/-END CERTIFICATE-/)) {
                                        ca.push(cert.join("\n"));
                                        cert=[];
                                }
                        }				
	
			if(last && cb) cb(ca);
		});
		return ca;
	}
}

module.exports = CertificateChainManager;
