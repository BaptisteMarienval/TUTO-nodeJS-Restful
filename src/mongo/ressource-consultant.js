var mongoose = require('mongoose');
//var config = require('../mongo/config');

var log = require('bristol');

var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;


var consultantsSchema = new Schema({
  prenom: String,
  nom: String,
  ville: String,
  email: String
}, {
  collection: 'consultants'
});



var ConsultantModel = mongoose.model('consultants', consultantsSchema);

//mongoose.connect(config.confDatabase.host+':'+config.confDatabase.port+'/'+config.confDatabase.name);


/***********************************
 *** Recuperation d'un consultant ***
 ***********************************/
var recupererConsultant = function(id, callback) {
  ConsultantModel.findOne({
    '_id': id
  }, function(err, reference) {
    if (err) {
      callback(err, null);
    } else {
      if (reference) {
        callback(null, reference);
      } else {
        log.info("consultant inconnu");
        callback(404, null, "Consultant Inconnu");
      }
    }
  });
}


/*********************************************************************
 *** Supprime d'une référence de la liste des référence produit ***
 *** à partir du code barre *******************************************
 **********************************************************************/
var supprimerConsultant = function(id, callback) {
  ConsultantModel.remove({
    '_id': id
  }, function(err, reference) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, null, "Consultant supprimé");
    }
  });
}

/**********************************************
 *** Recuperation de la liste des consultants ***
 ***********************************************/
var recupererListeConsultants = function(callback) {
  ConsultantModel.find({}, function(err, references) {
    if (!err) {
      if (references) {
        callback(null, references);
      } else {
        callback(404, null);
      }
    }
  });
}



/*********************************************************
 *** Ajout d'une référence dans la liste des références ***
 *** avec gestion de l'unicité ****************************
 **********************************************************/
var enregistrerConsultant = function(req, callback) {

  var reference = new ConsultantModel({
    prenom: req.body.prenom,
    nom: req.body.nom,
    ville: req.body.ville,
    email: req.body.email
  });

  reference.save(function(err) {
    if (err) {
      callback(err, null);
    } else {
      log.info('Ajout d un consultant dans mongo : ' + reference.prenom);
      callback(null, reference);
    }
  });
}



/*********************************************************
 *** Modification d'une référence dans la liste des références ***
 *** avec gestion de l'unicité ****************************
 **********************************************************/
var modifierConsultant = function(req, callback) {

  ConsultantModel.findById(req.params.id, function(err, reference) {

    if (err) {
      callback(err, null);
    } else {
      if (reference) {
        reference.prenom = req.body.prenom,
          reference.nom = req.body.nom,
          reference.ville = req.body.ville,
          reference.email = req.body.email

        reference.save(function(err) {
          if (err) {
            callback(err, null);
          } else {
            log.info('Modif d un consultant dans mongo : ' +
              reference.prenom);
            callback(null, reference);
          }
        });
      } else {
        callback(404, null)
      }
    }
  });
}


// EXPORTS
exports.recupererConsultant = recupererConsultant;
exports.enregistrerConsultant =
  enregistrerConsultant;
exports.recupererListeConsultants =
  recupererListeConsultants;
exports.supprimerConsultant =
  supprimerConsultant;
exports.modifierConsultant = modifierConsultant;
