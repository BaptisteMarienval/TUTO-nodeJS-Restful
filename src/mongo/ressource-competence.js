var mongoose = require('mongoose');
//var config = require('../mongo/config');

var log = require('bristol');

var Schema = mongoose.Schema;
// var ObjectId = Schema.ObjectId;


var competenceObject = new Schema({
    nom       : String, 
    niveau          : String,
    domaine          : String
}, { collection : 'competences' });



var Competences = mongoose.model('Competences', competenceObject);

//mongoose.connect(config.confDatabase.host+':'+config.confDatabase.port+'/'+config.confDatabase.name);


/***********************************
*** Recuperation d'une competence ***
***********************************/
var recupererCompetence = function(id, callback){
    Competences.findOne({'_id' : id}, function (err, reference) {
        if (!err) {
            if(reference != null) {
                callback(reference);
            } else {
                log.info("competence inconnue");
                callback(null);
            }
        }
    });
}


/******************************
*** Supprime d'une compétence **
********************************/
var supprimerCompetence = function(id, callback){
    Competences.remove({'_id' : id}, function (err, reference) {
        if (!err) {
            if(reference != null) {
                callback(reference);
            } else {
                callback(null);
            }
        }
    });
}

/**********************************************
*** Recuperation de la liste des competences ***
***********************************************/
var recupererListeCompetences = function(callback){
    Competences.find({}, function (err, references) {
        if (!err) {
            if(references != null) {
                callback(references);
            } else {
                callback(null);
            }
        }
    });
}



/*********************************************************
*** Ajout d'une compétence *************************** 
**********************************************************/
var enregistrerCompetence = function(req, callback){
    
    var reference = new Competences({
        nom: req.body.nom,
        domaine: req.body.domaine
    });
    
            reference.save(function (err) {
                if (err != null) {
                    callback(null);
                } else {
                    log.info('Ajout d une compétence dans mongo : '+reference.nom);
                    callback(reference);
                }
             });
}


// EXPORTS
exports.recupererCompetence = recupererCompetence;
exports.enregistrerCompetence = enregistrerCompetence;
exports.recupererListeCompetences = recupererListeCompetences;
exports.supprimerCompetence = supprimerCompetence;


