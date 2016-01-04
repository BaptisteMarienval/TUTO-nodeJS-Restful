// BASE SETUP
// =============================================================================
// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


require('./response');

// configure app

var port = process.env.PORT || 8080; // set our port

var log = require('bristol');
log.addTarget('console').withFormatter(
  'commonInfoModel');

var mongoose = require('mongoose');
var config = require('./mongo/config');
mongoose.connect(config.confDatabase
  .host + ':' + config.confDatabase.port +
  '/' + config.confDatabase.name,
  function(err) {
    if (err) log.error("Connexion à la base de données impossible");
  });

var consultant = require('./mongo/ressource-consultant');
var competence = require('./mongo/ressource-competence');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());



// ROUTES FOR OUR API
// =============================================================================
// create our router
var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  log.info(req.method, req.url);
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
    consultant.recupererListeConsultants(function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })

.post(function(req, res) {
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
    consultant.recupererConsultant(req.params.id, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })

.put(function(req, res) {
    consultant.modifierConsultant(req, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })
  .delete(function(req, res) {
    consultant.supprimerConsultant(req.params.id, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(msg);
      }
    });
  });

/** route /competences */
router.route('/competences')
  .get(function(req, res) {
    competence.recupererListeCompetences(function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })

.post(function(req, res) {
  competence.enregistrerCompetence(req, function(err, data, msg) {
    if (err) {
      res.respond(msg, err);
    } else {
      res.respond(data);
    }
  });
});

/** route /competences/:id */
router.route('/competences/:id')
  .get(function(req, res) {
    competence.recupererCompetence(req.params.id, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })

.put(function(req, res) {
    competence.modifierCompetence(req, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(data);
      }
    });
  })
  .delete(function(req, res) {
    competence.supprimerCompetence(req.params.id, function(err, data, msg) {
      if (err) {
        res.respond(msg, err);
      } else {
        res.respond(msg);
      }
    });
  });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
// START THE SERVER
// =============================================================================
app.listen(port);
log.info('Server is running on port ' + port);
