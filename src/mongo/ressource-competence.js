var mongoose = require('mongoose');
//var config = require('../mongo/config');

var log = require('bristol');

var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;


var competenceSchema = new Schema({
  nom: String,
  domaine: String
}, {
  collection: 'competences'
});



var CompetenceModel = mongoose.model('competences', competenceSchema);

//mongoose.connect(config.confDatabase.host+':'+config.confDatabase.port+'/'+config.confDatabase.name);


/***********************************
 *** Recuperation d'un consultant ***
 ***********************************/
var recupererCompetence = function(id, callback) {

  CompetenceModel.findOne({
    '_id': id
  }, function(err, reference) {
    if (err) {
      callback(400, err, null);
      log.info(
        "Une erreur s'est produite lors de la récuperation d'une compétence : " +
        err)
    } else {
      if (reference) {
        callback(null, reference, null);
      } else {
        callback(404, null, "Compétence Inconnue");
      }
    }
  });
}


/*********************************************************************
 *** Supprime d'une référence de la liste des référence produit ***
 *** à partir du code barre *******************************************
 **********************************************************************/
var supprimerCompetence = function(id, callback) {
  CompetenceModel.remove({
    '_id': id
  }, function(err, reference) {
    if (err) {
      log.info(
        "Une erreur s'est produite lors de la suppression d'une compétence : " +
        err)
      callback(400, err, null);
    } else {
      callback(204, null, "Consultant supprimé");
    }
  });
}

/**********************************************
 *** Recuperation de la liste des consultants ***
 ***********************************************/
var recupererListeCompetences = function(callback) {
  CompetenceModel.find({}, function(err, references) {
    if (!err) {
      if (references) {
        callback(null, references, null);
      } else {
        callback(404, null, "La liste des compétences est vide.");
      }
    } else {
      log.info(
        "Une erreur s'est produite lors de la récuperation de la liste des compétences : " +
        err);
      callback(400, err, null);
    }
  });
}



/*********************************************************
 *** Ajout d'une référence dans la liste des références ***
 *** avec gestion de l'unicité ****************************
 **********************************************************/
var enregistrerCompetence = function(req, callback) {

  if (!req.body || !req.body.nom || !req.body.domaine) {
    callback(400, null, "Les champs nom et domaine sont obligatoires.");
  } else {

    var reference = new CompetenceModel({
      nom: req.body.nom,
      domaine: req.body.domaine
    });

    reference.save(function(err) {
      if (err) {
        log.info(
          "Une erreur s'est produite lors de l'enregistrement d'une compétence : " +
          err);
        callback(400, err, null);
      } else {
        callback(null, reference, "Compétence créée.");
      }
    });
  }
}

/*********************************************************
 *** Modification d'une référence dans la liste des références ***
 *** avec gestion de l'unicité ****************************
 **********************************************************/
var modifierCompetence = function(req, callback) {
  if (!req.body || !req.body.nom || !req.body.domaine) {
    callback(400, null, "Les champs nom et domaine sont obligatoires.");
  } else {
    CompetenceModel.findById(req.params.id, function(err, reference) {
      if (err) {
        log.info(
          "Une erreur s'est produite lors de la modification d'une compétence  : " +
          err);
        callback(400, err, null);
      } else {
        if (reference) {
          reference.nom = req.body.nom;
          reference.domaine = req.body.domaine;

          reference.save(function(err) {
            if (err) {
              log.info(
                "Une erreur s'est produite lors de la modification d'une compétence : " +
                err);
              callback(400, err, null);
            } else {
              callback(null, reference, "Compétence modifiée.");
            }
          });
        } else {
          callback(404, null, "Compétence inconnue.")
        }
      }
    });
  }
}

// EXPORTS
exports.recupererCompetence = recupererCompetence;
exports.enregistrerCompetence = enregistrerCompetence;
exports.recupererListeCompetences = recupererListeCompetences;
exports.supprimerCompetence = supprimerCompetence;
exports.modifierCompetence = modifierCompetence;
