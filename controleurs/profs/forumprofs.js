const { parseInt } = require('lodash');
const { ObjectId } = require('mongodb');

let express = require('express')
let app = express()
let bodyParser = require('body-parser') //permet de parser les donner envoyer par posts
let session = require("express-session") //permet d'appeler la session
const validator = require('express-validator');
const { body ,validationResult  } = require('express-validator');
const { response, request } = require('express');
const { toLower, isEmpty } = require('lodash');

//nos middelware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(session({ // le middleware de session
    secret: "aaaaweeeeeeeeeee", 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}))
exports.forum = function(request, response) {
    /*
ce middelware permet d'envoyer tout les discution d'un
    */
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    //url de connection
    const url = "mongodb://localhost:27017/univ";
    //nom de la bdd
    const dbName = 'univ';
    //requette
    var cour =   request.params.cour ;
    var classe = request.params.classe;
    var departe = request.params.departe;
    console.log(departe)
    response.cookie('cour', cour);
    response.cookie('classe', classe);
    response.cookie('departe', departe);
    var question = ''
    //creation d'un nouveau mongoclient
    const client = new MongoClient(url ,  { useUnifiedTopology: true });
    //utilisation de la methode connect pour la connection au serveur
    client.connect( function (err, client) {
        assert.equal(null, err);
        
        const db = client.db(dbName);
        const discution = db.collection(departe);
     
        discution.find({"classe": classe}).toArray(function (err, discut) {
            for (let k = 0; k < discut.length; k++) {
                if (discut[k]['name'] === cour) {
                    question = discut[k]['question']
                    console.log("c'est bon")
                }             
            }
            response.locals.nom = request.cookies.nom
            response.locals.identifiant = request.cookies.identifiant
            response.locals.classe = request.cookies.classe
            response.locals.cour = request.cookies.cour
            response.locals.departe = request.cookies.departe
            response.render('profs/forum',  { reponse: cour, laclasse: classe, question: question, departe: departe}) 
        })
        
    })
 //connection with mongoDB


}
exports.reponsedunediscute = function(request, response) {
  //elle permet de renvoyer tout les reponse d'un commentaire ou questionnaire
  const MongoClient = require('mongodb').MongoClient;
  var MongoObjectID = require("mongodb").ObjectID;
  var idfind = request.params.id;
  var classe = request.params.classe;
  var departe = request.params.departe;
  var cour = request.params.cour;
  var objtofind = { _id: new MongoObjectID(idfind) };
  const assert = require('assert');
  //url de connection
  const url = "mongodb://localhost:27017/univ";
  //nom de la bdd
  const dbName = 'univ';
  //recuperer la valeur de recherche
  var  question = '';
  //requette
  var lesreponse = '';
  var dateposeur = '';
  var datecoment = '';
  response.cookie('idfind', idfind);
  //creation d'un nouveau mongoclient
  const client = new MongoClient(url ,  { useUnifiedTopology: true });
  //utilisation de la methode connect pour la connection au serveur
  client.connect( function (err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      const discution = db.collection(departe);
      discution.find({"name": cour, "classe" : classe}).toArray(function (err, discut) {
          questioner = discut[0]['question'];
          for (let i = 0; i < questioner.length; i++) {
              if (questioner[i].id == idfind) {
                  lesreponse = questioner[i]['reponse'];
                  question = questioner[i];
              }
          }
          

          response.locals.nom = request.cookies.nom
          response.locals.identifiant = request.cookies.identifiant
          response.locals.classe = request.cookies.classe
          response.locals.cour = request.cookies.cour
          response.locals.departe = request.cookies.departe
      response.render('profs/forumdetails', { question: question, lesreponse: lesreponse});
      }) 
      
  })


};


exports.repondrequestion = [
  /*
ce middelware permet de repondre a une question en ajouant la reponse 
directement dans la bdd
  */
  // verifie si le matricule est un nombre.
 body('message').isLength({ min: 1}).withMessage('Veuilez bien saisir un message').trim(),
 (request, response, next) => {

   // Extract the validation errors from a request.
   const errors = validator.validationResult(request);
   //les erreurs 
   var erreurauth = []
   var nomerreur = '';
   var matriculerreur = '';
   // Create a genre object with escaped and trimmed data
   if (!errors.isEmpty()) {
  //si le commentaaire est vide on ajoute pas dans la bdd mais on envoie les reponses
      const MongoClient = require('mongodb').MongoClient;
      var MongoObjectID = require("mongodb").ObjectID;
      var idfind = request.cookies.idfind;
      var classe = request.cookies.classe;
      var cour = request.cookies.cour;
      var departe = request.cookies.departe
      var objtofind = { _id: new MongoObjectID(idfind) };
      const assert = require('assert');
      //url de connection
      const url = "mongodb://localhost:27017/univ";
      //nom de la bdd
      const dbName = 'univ';
      //recuperer la valeur de recherche
      var  question = '';
      //requette
      var lesreponse = '';
      var message = request.body.message;
      var pseudo = request.cookies.nom;
      //"id": "5f17844ff8e07f1b5418e154"
      //creation d'un nouveau mongoclient
      const client = new MongoClient(url ,  { useUnifiedTopology: true });
client.connect( function (err, client) {
  const db = client.db(dbName);
  const rp = db.collection(departe);
  const discution = db.collection(departe);
      
  var erreur = errors.array();
  discution.find({"name": cour, "classe" : classe}).toArray(function (err, discut) {
   questioner = discut[0]['question'];
   for (let i = 0; i < questioner.length; i++) {
       if (questioner[i].id == idfind) {
           lesreponse = questioner[i]['reponse'];
           question = questioner[i];  
           dateposeur = moment(question['date']).fromNow();
       }
     
   }
   response.render('profs/forumdetails', { question: question, lesreponse: lesreponse});   
})

  
response.locals.nom = request.cookies.nom
response.locals.identifiant = request.cookies.identifiant
response.locals.classe = request.cookies.classe
response.locals.cour= request.cookies.cour
response.locals.departe = request.cookies.departe

})
    } else {
       //si le commentaire n'est pas vide on ajoute le commentare dans la bdd
      const MongoClient = require('mongodb').MongoClient;
      var MongoObjectID = require("mongodb").ObjectID;
      var idfind = request.cookies.idfind;
      var classe = request.cookies.classe;
      var cour = request.cookies.cour;
      var departe = request.cookies.departe;
      var objtofind = { _id: new MongoObjectID(idfind) };
      const assert = require('assert');
      //url de connection
      const url = "mongodb://localhost:27017/univ";
      //nom de la bdd
      const dbName = 'univ';
      //recuperer la valeur de recherche
      var  question = '';
      //requette
      var lesreponse = '';
      var message = request.body.message;
      var pseudo = request.cookies.nom; 
      var proffesseurs = "proffesseurs " + pseudo
      //"id": "5f17844ff8e07f1b5418e154"
      //creation d'un nouveau mongoclient
      const client = new MongoClient(url ,  { useUnifiedTopology: true });
     
    //utilisation de la methode connect pour la connection au serveur
    client.connect( function (err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
      const rp = db.collection(departe);
      const discution = db.collection(departe);
      
      const query = {"name": cour, "classe" : classe , "question.id": ObjectId(idfind) }
      const updateDocument = { 
          $push : { "question.$.reponse" : {
              "pseudo": proffesseurs,
              "reponse": message,
              "date": new Date()
            }}
      }
      const result =  rp.updateOne(query, updateDocument);
         
      response.locals.nom = request.cookies.nom
      response.locals.identifiant = request.cookies.identifiant
      response.locals.classe = request.cookies.classe
      response.locals.cour = request.cookies.cour
      response.locals.departe = request.cookies.departe
      response.redirect("/profs/reponsequestion");
     
  }) 
     
    
   }
 }
]
exports.redirectreponse = function (request, response) {
  /*
  le middleware qui permet de renvoyer les reponse au question
  */
     //si le commentaire n'est pas vide on ajoute le commentare dans la bdd
     const MongoClient = require('mongodb').MongoClient;
     var MongoObjectID = require("mongodb").ObjectID;
     var idfind = request.cookies.idfind;
     var classe = request.cookies.classe;
     var cour = request.cookies.cour;
     var departe = request.cookies.departe;
     var objtofind = { _id: new MongoObjectID(idfind) };
     const assert = require('assert');
     //url de connection
     const url = "mongodb://localhost:27017/univ";
     //nom de la bdd
     const dbName = 'univ';
     //recuperer la valeur de recherche
     var  question = '';
     //requette
     var lesreponse = '';
     var message = request.body.message;
     var pseudo = request.cookies.nom;
     //"id": "5f17844ff8e07f1b5418e154"
     //creation d'un nouveau mongoclient
     const client = new MongoClient(url ,  { useUnifiedTopology: true });
    
   //utilisation de la methode connect pour la connection au serveur
   client.connect( function (err, client) {
     assert.equal(null, err);
     const db = client.db(dbName);
     const discution = db.collection(departe);
     
     discution.find({"name": cour, "classe" : classe }).toArray(function (err, discut) {
         questioner = discut[0]['question'];
         for (let i = 0; i < questioner.length; i++) {
             if (questioner[i].id == idfind) {
                 lesreponse = questioner[i]['reponse'];
                 question = questioner[i];
             }
           
         }
     
         response.render('profs/forumdetails', { question: question, lesreponse: lesreponse});   
     })
     
     response.locals.nom = request.cookies.nom
     response.locals.identifiant = request.cookies.identifiant
     response.locals.classe = request.cookies.classe
     response.locals.cour = request.cookies.cour
     response.locals.departe = request.cookies.departe
    
 }) 
   
  
}
exports.poser = [ 
  /*
ce middeleware permet d'ajouter une question a une matiere donner
  */
    // verifie si le matricule est un nombre.
   body('question').isLength({min: 1}).withMessage('Veuilez bien saisir un message').trim(),
   (request, response, next) => {

     // Extract the validation errors from a request.
    const errors = validator.validationResult(request);
     //les erreurs 
     var erreurauth = []
     var nomerreur = '';
     var matriculerreur = '';
     // Create a genre object with escaped and trimmed data
    if (!errors.isEmpty()) {
    //si le commentaaire est vide on ajoute pas dans la bdd mais on envoie les reponses
    response.locals.nom = request.cookies.nom
    response.locals.identifiant = request.cookies.identifiant
    response.locals.classe = request.cookies.classe
    response.locals.cour = request.cookies.cour
    response.locals.departe = request.cookies.departe
    response.render('profs/forumnouvosujet')
    
      } else{
        const { ObjectID } = require('mongodb');
        //si le commentaire n'est pas vide on ajoute le commentare dans la bdd
           const MongoClient = require('mongodb').MongoClient;
           var MongoObjectID = require("mongodb").ObjectID;
           var idfind = request.cookies.idfind;
           var classe = request.cookies.classe;
           var cour = request.cookies.cour;
           var departe = request.cookies.departe;
           var objtofind = { _id: new MongoObjectID(idfind) };
           const assert = require('assert');
           //url de connection
           const url = "mongodb://localhost:27017/univ";
           //nom de la bdd
           const dbName = 'univ';
           //recuperer la valeur de recherche
           var  question = '';
           //requette
           var lesreponse = '';
           var question = request.body.question;
           var pseudo = request.cookies.nom;
           var proffesseurs = "Proffesseur " + pseudo
           //"id": "5f17844ff8e07f1b5418e154"
           //creation d'un nouveau mongoclient
           const client = new MongoClient(url ,  { useUnifiedTopology: true });
          
         //utilisation de la methode connect pour la connection au serveur
         client.connect( function (err, client) {
           assert.equal(null, err);
           console.log('connecter corectement');
           const db = client.db(dbName);
           const rp = db.collection(departe);        
           const query = {"name": cour, "classe" : classe }
           const updateDocument = { 
               $push : { "question" : {
                   "question": question,
                   "id": new ObjectID(),
                   "pseudo": proffesseurs,
                   "date": new Date(),
                   "reponse": []
                 }}
           }
            rp.updateOne(query, updateDocument);
           
          response.locals.nom = request.cookies.nom
          response.locals.identifiant= request.cookies.identifiant
          response.locals.classe = request.cookies.classe
          response.locals.cour = request.cookies.cour
          response.locals.departe = request.cookies.departe
          response.redirect('/profs/posequestion')
     
    
          
       }) 
          
         
        
      }
     
   }
]
exports.poserredirect = function (request, response) {
  /*
Middle permet de renvoyer les reponse poser dans une matiere poser lorsque on redirige vers lui
  */
  const { ObjectID } = require('mongodb');
  //si le commentaire n'est pas vide on ajoute le commentare dans la bdd
     const MongoClient = require('mongodb').MongoClient;
     var MongoObjectID = require("mongodb").ObjectID;
     var idfind = request.cookies.idfind;
     var classe = request.cookies.classe;
     var cour = request.cookies.cour;
     var departe = request.cookies.departe;
     var objtofind = { _id: new MongoObjectID(idfind) };
     const assert = require('assert');
     //url de connection
     const url = "mongodb://localhost:27017/univ";
     //nom de la bdd
     const dbName = 'univ';
     //recuperer la valeur de recherche
     var  question = '';
     //requette
     var lesreponse = '';
     var question = request.body.question;
     var pseudo = request.cookies.nom;
     //"id": "5f17844ff8e07f1b5418e154"
     //creation d'un nouveau mongoclient
     const client = new MongoClient(url ,  { useUnifiedTopology: true });
//utilisation de la methode connect pour la connection au serveur
client.connect( function (err, client) {
  assert.equal(null, err);
  const db = client.db(dbName);
  const discution = db.collection(departe);
  
  discution.find({"name": cour, "classe" : classe }).toArray(function (err, discut) {
    for (let k = 0; k < discut.length; k++) {
            question = discut[k]['question']        
    }
    response.locals.nom = request.cookies.nom
    response.locals.identifiant = request.cookies.identifiant
    response.locals.classe = request.cookies.classe
    response.locals.cour = request.cookies.cour
    response.locals.departe = request.cookies.departe
response.render('profs/forum',  { reponse: cour, laclasse: classe, question: question})

})
 
}) 


}