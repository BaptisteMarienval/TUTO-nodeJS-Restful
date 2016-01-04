var log = require('bristol');
log.addTarget('console').withFormatter('commonInfoModel');

var consultant = require('./mongo/ressource-consultant');
var competence = require('./mongo/ressource-competence');

var restify = require('restify'),
    server = restify.createServer();
    
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
    
    
    var mongoose = require('mongoose');
    var config = require('./mongo/config');
    mongoose.connect(config.confDatabase.host+':'+config.confDatabase.port+'/'+config.confDatabase.name);
    
/**
 * RESSOURCE Consultants
 */
    
 /** Retourne la liste des consultants  **/
server.get('/api/consultants', function (req, res) {
  log.info("GET /api/consultants");
	consultant.recupererListeConsultants(function(data) {
	    if (data != null) {
	        res.json(data);
	    } else {
	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	});
});

 /** Retourne les informations d'un consultant  **/
server.get('/api/consultants/:id', function (req, res) {
  log.info("GET /api/consultants/"+req.params.id);
	consultant.recupererConsultant(req.params.id, function(data) {
	    if (data != null) {
	        res.json(data);
	    } else {
	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	});
});

 /** Ajoute un consultant  **/
server.post('/api/consultants', function create(req, res) {
	log.info("POST /api/consultants");
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	consultant.enregistrerConsultant(req, function(data) {
	    if (data != null) {
	    	res.json(data);
	    }  else {
	    	res.writeHead(409, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	})
 });

 /** Supprime un consultant  **/
server.del('/api/consultants/:id', function (req, res) {
  log.info("DELETE /api/consultants/"+req.params.id);
	consultant.supprimerConsultant(req.params.id, function(data) {
	    if (data != null) {
	        res.json(data);
	    } else {
	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	});
});


/**
 * RESSOURCE Competences
 */
    
 /** Retourne la liste des competences  **/
server.get('/api/competences', function (req, res) {
  log.info("GET /api/competences");
	competence.recupererListeCompetences(function(data) {
	    if (data != null) {
	        res.json(data);
	    } else {
	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	});
});

 /** Retourne les informations d'une competence  **/
server.get('/api/competences/:id', function (req, res) {
  log.info("GET /api/competences/"+req.params.id);
	competence.recupererCompetence(req.params.id, function(data) {
	    if (data != null) {
	        res.json(data);
	    } else {
	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	});
});

 /** Ajoute une competence  **/
server.post('/api/competences', function create(req, res) {
	log.info("POST /api/competences");
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	competence.enregistrerCompetence(req, function(data) {
	    if (data != null) {
	    	res.json(data);
	    }  else {
	    	res.writeHead(409, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	})
 });

 /** Supprime une competence  **/
server.del('/api/competences/:id', function (req, res) {
  log.info("DELETE /api/competences/"+req.params.id);
	competence.supprimerCompetence(req.params.id, function(data) {
	    if (data != null) {
	        res.json(data);
	    } else {
	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
	    	res.end();
	    }
	});
});



server.listen(1337);
console.log("Server started");
