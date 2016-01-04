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


/***********************************
 *** Recuperation d'un consultant ***
 ***********************************/
var recupererConsultant = function(id, callback) {
  ConsultantModel.findOne({
    '_id': id
  }, function(err, reference) {
    if (err) {
      callback(400, err, null);
      log.info(
        "Une erreur s'est produite lors de la récuperation d'un consultant : " +
        err)
    } else {
      if (reference) {
        callback(null, reference, null);
      } else {
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
      log.info(
        "Une erreur s'est produite lors de la suppression d'un consultant : " +
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
var recupererListeConsultants = function(callback) {
  ConsultantModel.find({}, function(err, references) {
    if (!err) {
      if (references) {
        callback(null, references, null);
      } else {
        callback(404, null, "La liste des consultants est vide.");
      }
    } else {
      log.info(
        "Une erreur s'est produite lors de la récupération de la liste des consultants : " +
        err)
      callback(400, err, null);
    }
  });
}

/*********************************************************
 *** Ajout d'une référence dans la liste des références ***
 *** avec gestion de l'unicité ****************************
 **********************************************************/
var enregistrerConsultant = function(req, callback) {


  if (!req.body || !req.body.prenom || !req.body.nom) {
    callback(400, null, "Les champs nom et prénom sont obligatoires.");
  } else {
    var reference = new ConsultantModel({
      prenom: req.body.prenom,
      nom: req.body.nom,
      ville: req.body.ville,
      email: req.body.email
    });

    reference.save(function(err) {
      if (err) {
        log.info(
          "Une erreur s'est produite lors de l'enregistrement du consultant : " +
          err);
        callback(400, err, null);
      } else {
        callback(201, reference, "Consultant crée.");
      }
    });
  }
}



/*********************************************************
 *** Modification d'une référence dans la liste des références ***
 *** avec gestion de l'unicité ****************************
 **********************************************************/
var modifierConsultant = function(req, callback) {

  if (!req.body || !req.body.prenom || !req.body.nom) {
    callback(400, null, "Les champs nom et prénom sont obligatoires.");
  } else {

    ConsultantModel.findById(req.params.id, function(err, reference) {

      if (err) {
        log.info(
          "Une erreur s'est produite lors de la modification d'un consultant : " +
          err);
        callback(400, err, null);
      } else {
        if (reference) {
          reference.prenom = req.body.prenom;
          reference.nom = req.body.nom;
          reference.ville = req.body.ville;
          reference.email = req.body.email;

          reference.save(function(err) {
            if (err) {
              log.info(
                "Une erreur s'est produite lors de la modification du consultant : " +
                err)
              callback(400, err, null);
            } else {
              callback(null, reference, "Consultant modifié.");
            }
          });
        } else {
          callback(404, null, 'Consultant inconnu.')
        }
      }
    });
  }
}


// EXPORTS
exports.recupererConsultant = recupererConsultant;
exports.enregistrerConsultant = enregistrerConsultant;
exports.recupererListeConsultants = recupererListeConsultants;
exports.supprimerConsultant = supprimerConsultant;
exports.modifierConsultant = modifierConsultant;
