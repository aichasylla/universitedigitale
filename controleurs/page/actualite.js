const { parseInt } = require('lodash');

exports.actualite = function(request, response) {
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    //url de connection
    const url = "mongodb://localhost:27017/univ";
    //nom de la bdd
    const dbName = 'univ';
    //recuperer la valeur de recherche
    var  valeur = [];
    //requette
    var lien = [];
    //creation d'un nouveau mongoclient
    const client = new MongoClient(url ,  { useUnifiedTopology: true
    });
    //utilisation de la methode connect pour la connection au serveur
    client.connect( function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const col = db.collection('actualite');
        col.find({}).toArray(function (err, docs) {
            lien = docs;
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].id == request.params.id) {
                  valeur = docs[i]
                  ;     
                  response.render('page/actualite', { reponse: valeur, requette: lien })
                }
                
                
            }
        })

        
    })


};
exports.lien = function(request, response) {
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    //url de connection
    const url = "mongodb://localhost:27017/univ";
    //nom de la bdd
    const dbName = 'univ';
    //recuperer la valeur de recherche
    var  valeur = [];
    //requette
    var lien = [];
    //creation d'un nouveau mongoclient
    const client = new MongoClient(url ,  { useUnifiedTopology: true
    });
    //utilisation de la methode connect pour la connection au serveur
    client.connect( function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const col = db.collection('actualite');
        col.find({}).toArray(function (err, docs) {
            lien = docs;
                  response.render('page/index', { requette: lien })
                
                
                
            
        })

        
    })


};