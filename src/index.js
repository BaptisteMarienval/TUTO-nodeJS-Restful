// BASE SETUP
// =============================================================================
// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
// configure app

var port = process.env.PORT || 8080; // set our port

var log = require('bristol');
log.addTarget('console').withFormatter(
  'commonInfoModel');

var mongoose = require('mongoose');
var config = require('./mongo/config');
mongoose.connect(config.confDatabase
  .host + ':' + config.confDatabase.port +
  '/' + config.confDatabase.name);

var consultant = require('./mongo/ressource-consultant');
var competence = require('./mongo/ressource-competence');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// Redefine response
http.ServerResponse.prototype.respond = function(content, status) {
  if ('undefined' == typeof status) { // only one parameter found
    if ('number' == typeof content || !isNaN(parseInt(content))) { // usage "respond(status)"
      status = parseInt(content);
      content = undefined;
    } else { // usage "respond(content)"
      status = 200;
    }
  }
  if (status != 200) { // error
    content = {
      "code": status,
      "status": http.STATUS_CODES[status],
      "message": content && content.toString() || null
    };
  }
  if ('object' != typeof content) { // wrap content if necessary
    content = {
      "result": content
    };
  }
  // respond with JSON data
  this.status(status).send(JSON.stringify(content));
};



// ROUTES FOR OUR API
// =============================================================================
// create our router
var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  //  log.info('new Request incoming');
  next();
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({
    message: 'SkillBrowser API'
  });
});


/** route /Consultants */
router.route('/consultants')
  .get(function(req, res) {
    log.info("GET /api/consultants");
    consultant.recupererListeConsultants(function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })

.post(function(req, res) {
  log.info("POST /api/consultants");
  consultant.enregistrerConsultant(req, function(err, data, msg) {
    if (err) {
      res.respond(msg, err);
    } else {
      res.respond(data);
    }
  });
});

/** route /Consultants/:id */
router.route('/consultants/:id')
  .get(function(req, res) {
    log.info("GET /api/consultants/" + req.params.id);

    consultant.recupererConsultant(req.params.id, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })

.put(function(req, res) {
    log.info("PUT /api/consultants/" + req.params.id);
    consultant.modifierConsultant(req, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })
  .delete(function(req, res) {
    log.info("DELETE /api/consultants/" + req.params.id);
    consultant.supprimerConsultant(req.params.id, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(msg);
      }
    });
  });


//  /** Retourne la liste des consultants  **/
// server.get('/api/consultants', function (req, res) {
//   log.info("GET /api/consultants");
// 	consultant.recupererListeConsultants(function(data) {
// 	    if (data != null) {
// 	        res.json(data);
// 	    } else {
// 	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	});
// });
//
//  /** Retourne les informations d'un consultant  **/
// server.get('/api/consultants/:id', function (req, res) {
//   log.info("GET /api/consultants/"+req.params.id);
// 	consultant.recupererConsultant(req.params.id, function(data) {
// 	    if (data != null) {
// 	        res.json(data);
// 	    } else {
// 	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	});
// });
//
//  /** Ajoute un consultant  **/
// server.post('/api/consultants', function create(req, res) {
// 	log.info("POST /api/consultants");
// 	res.header("Access-Control-Allow-Origin", "*");
//   	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	consultant.enregistrerConsultant(req, function(data) {
// 	    if (data != null) {
// 	    	res.json(data);
// 	    }  else {
// 	    	res.writeHead(409, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	})
//  });
//
//  /** Supprime un consultant  **/
// server.del('/api/consultants/:id', function (req, res) {
//   log.info("DELETE /api/consultants/"+req.params.id);
// 	consultant.supprimerConsultant(req.params.id, function(data) {
// 	    if (data != null) {
// 	        res.json(data);
// 	    } else {
// 	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	});
// });
//
//
// /**
//  * RESSOURCE Competences
//  */
//
//  /** Retourne la liste des competences  **/
// server.get('/api/competences', function (req, res) {
//   log.info("GET /api/competences");
// 	competence.recupererListeCompetences(function(data) {
// 	    if (data != null) {
// 	        res.json(data);
// 	    } else {
// 	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	});
// });
//
//  /** Retourne les informations d'une competence  **/
// server.get('/api/competences/:id', function (req, res) {
//   log.info("GET /api/competences/"+req.params.id);
// 	competence.recupererCompetence(req.params.id, function(data) {
// 	    if (data != null) {
// 	        res.json(data);
// 	    } else {
// 	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	});
// });
//
//  /** Ajoute une competence  **/
// server.post('/api/competences', function create(req, res) {
// 	log.info("POST /api/competences");
// 	res.header("Access-Control-Allow-Origin", "*");
//   	res.header("Access-Control-Allow-Headers", "X-Requested-With");
// 	competence.enregistrerCompetence(req, function(data) {
// 	    if (data != null) {
// 	    	res.json(data);
// 	    }  else {
// 	    	res.writeHead(409, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	})
//  });
//
//  /** Supprime une competence  **/
// server.del('/api/competences/:id', function (req, res) {
//   log.info("DELETE /api/competences/"+req.params.id);
// 	competence.supprimerCompetence(req.params.id, function(data) {
// 	    if (data != null) {
// 	        res.json(data);
// 	    } else {
// 	    	res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
// 	    	res.end();
// 	    }
// 	});
// });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
// START THE SERVER
// =============================================================================
app.listen(port);
log.info('Magic happens on port ' + port);
