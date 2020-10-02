
let express = require('express')
let app = express()
let bodyParser = require('body-parser') //permet de parser les donner envoyer par posts
let session = require("express-session") //permet d'appeler la session
const validator = require('express-validator');
const { body ,validationResult  } = require('express-validator');
const bcrypt = require("bcryptjs")//permet de hacher le mot de passe
const saltRounds = 10;
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
// Handle Genre create on POST.
exports.connection =  [
  /*
ce middelware permet de verifier si un compte existe dans la bdd si elle existe on redirect
  */
   
    // verifie si le matricule est un nombre.
    
    body('matricule').isNumeric().withMessage('Veuilez bien saisir un nombre').trim(),
    body('matricule').isLength({ min: 8, max:8}).withMessage('Veuilez bien saisir un matricule de 8 caractere').trim(),
    body('motdepasse', 'Mot de passe tres court').isLength({ min: 4 }).trim(),
    body('classe', 'veuillez choisir une classe').isLength({ min: 1 }),
  
    (request, response, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(request);
  
      // Create a genre object with escaped and trimmed data
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        var erreur = errors.array();
        response.render('page/espace', { erreur: erreur});
        
        return;
      }
      else {
        var erreurauth = []
        let nomerreur = '';
        // Data from form is valid.
        const MongoClient = require('mongodb').MongoClient;
        const assert = require('assert');
        //url de connection
        const url = "mongodb://localhost:27017/univ";
        //nom de la bdd
        const dbName = 'univ';
        //creation d'un nouveau mongoclient
        const client = new MongoClient(url ,  { useUnifiedTopology: true });
        //utilisation de la methode connect pour la connection au serveur
        client.connect( function (err, client) {
          const db = client.db(dbName);
          const inscrit = db.collection('inscritetudiant');
          const matiere = db.collection("matiere")
          var monmatricule = parseInt(request.body.matricule);
          var motdepasse = request.body.motdepasse;
          var classe = request.body.classe;
          var departe = request.body.departe
          var gh = ''
          inscrit.find({"name": request.body.departe, "classe.0.nom": classe}).toArray(function (err, inscription) { 
            for (let i = 0; i < inscription[0]['classe'].length; i++) {
              if (inscription[0]['classe'][i].nom == classe ) {
               for (let k = 0; k < inscription[0]['classe'][i]['etudiant'].length; k++) {
                if (inscription[0]['classe'][i]['etudiant'][k].Matricule == monmatricule ) {
                  gh = "xes pas correcte"
                  bcrypt.compare(motdepasse, inscription[0]['classe'][i]['etudiant'][k].Motdepasse, function(err, isMatch) {
                    if (err) {
                      throw err
                    } else if (!isMatch) {
                    response.render('page/espace', {authentifierreur: "veuillez bien saisir les informations"})
                   
                    } else {
                      var tableau = Array();   
                      var mesmatiere = ''
                      var Nom = inscription[0]['classe'][i]['etudiant'][k].Nom
              matiere.find({"name": request.body.departe, "classe.0.nom": classe}).toArray(function (err, cours) {
                
                for (var j = 0; j < cours[0]['classe'].length; j++) {
                  if (cours[0]['classe'][j].nom == classe ) {
                    mesmatiere = cours[0]['classe'][j].lesmatiere;
                    for (var l = 0; l < mesmatiere.length; l++) {
                      const element = mesmatiere[l];
                      tableau.push(element)
                      
                    }
                    //console.log(mesmatiere)
                  }
                }
                  
              console.log(tableau)      
              //stockage des informations dans les sessions
              response.cookie('nom', Nom);
              response.cookie('monmatricule', monmatricule);
              response.cookie('classe', classe);
              response.cookie("departe", departe)
              response.cookie("mesmatiere", tableau)
              response.locals.nom = Nom;
              response.locals.matricule = monmatricule;
              response.locals.classe = classe;
              response.locals.mesmatiere = tableau;
              response.locals.departe = departe;
              response.redirect("/lescours")
            })   
           
                      
                    }
                  })
                    
                    
                }
                 
               }
              }
             
                }
                if(isEmpty(gh)){
                        response.render('page/espace', {authentifierreur: "veuillez bien saisir les informations"})
              
                        }
           
          })
          
        })  
        
             }
    }
  ];
  exports.verificationredirect = function (request, response) {
    /*
ce middelware permet d'acceder a  la page forumapprentissage
    */
                    response.locals.nom = request.cookies.nom;
                    response.locals.matricule = request.cookies.monmatricule;
                    response.locals.classe = request.cookies.classe;
                    response.locals.departe = request.cookies.departe;
                    response.locals.mesmatiere = request.cookies.mesmatiere;
                    response.render('page/lescours');
  }
  exports.creer =  [
    /*
ce middelware permet de creer un compte
    */
   // verifie si le matricule est un nombre.
   body('nom').isLength({ min: 3}).withMessage('Veuilez bien saisir un nom long').trim(),
   body('matricule').isNumeric().withMessage('Veuilez bien saisir un nombre').trim(),
   body('matricule').isLength({ min: 8, max:8}).withMessage('Veuilez bien saisir un matricule de 8 caractere').trim(),
   body('telephone').isNumeric().withMessage('Veuilez bien saisir un nombre').trim(),
   body('telephone').matches(/^6[2,5,6]{1}[0-9]{7}$/).withMessage('Veuilez bien saisir un numero valide').trim(),
   body('motdepasse', 'Veuillez saisir un mot de passe de plus de quatre caractere').isLength({ min: 4 }).trim(),
   body('motdepasse').custom((value, { req }) => {
    if (value !== req.body.motdepasse1) {
      throw new Error('les mots de passe ne sont pas identique');
    }
    
    // Indicates the success of this synchronous custom validator
    return true;
  }),
   body('classe', 'veuillez choisir une classe').trim().isLength({ min: 1 }),
   (request, response, next) => {

     // Extract the validation errors from a request.
     const errors = validator.validationResult(request);
     //les erreurs 
     var erreurauth = []
     var nomerreur = '';
     var matriculerreur = '';
     // Create a genre object with escaped and trimmed data
     if (!errors.isEmpty()) {
       // There are errors. Render the form again with sanitized values/error messages.
       var erreur = errors.array();
       response.render('page/creercompteetudiant', { erreur: erreur});
       
       return;
     }
     else {
      const MongoClient = require('mongodb').MongoClient;
      const assert = require('assert');
      //url de connection
      const url = "mongodb://localhost:27017/univ";
      //nom de la bdd
      const dbName = 'univ';
      //creation d'un nouveau mongoclient
      const client = new MongoClient(url ,  { useUnifiedTopology: true });
      var mesmatiere = ''
      //utilisation de la methode connect pour la connection au serveur
      client.connect( function (err, client) {
          assert.equal(null, err);
          //console.log('connecter corectement');
          const db = client.db(dbName);
          const matricule = db.collection('authentifietudiant');
          const inscrit = db.collection('inscritetudiant');
          const matiere = db.collection("matiere")
          var nom = request.body.nom;
          var Nom = nom.toLowerCase();
          var monmatricule = parseInt(request.body.matricule);
          var telephone = request.body.telephone; 
          var motdepasse = request.body.motdepasse;
          var classe = request.body.classe;
          var departe = request.body.departe;
          var mesmatiere ='';
          matricule.find({"name": request.body.departe, "classe.0.nom": classe}).toArray(function (err, discut) { 
           
            for (let i = 0; i < discut[0]['classe'].length; i++) {
              if (discut[0]['classe'][i].nom == classe ) {
               for (let j = 0; j < discut[0]['classe'][i].etudiant.length; j++) {
                 const element = discut[0]['classe'][i].etudiant[j];
                 if (discut[0]['classe'][i].etudiant[j].Nom == Nom && discut[0]['classe'][i].etudiant[j].Matricule == parseInt(request.body.matricule)) {
                  nomerreur = "votre nom est correcte";
                  erreurauth.push(nomerreur)
             } 
                 
               }

              }         
           }
           if (isEmpty(erreurauth)) { //si les nom ou matricule ne correspond pas on envoie une erreur de non correspondance
            response.render('page/creercompteetudiant', {authentifierreur: "veuillez bien saisir les informations"});
             
           }else{
              bcrypt.hash(motdepasse, 10, (err, hash) => {
                if (err) {
                  console.error(err)
                  return
                }
              
              inscrit.updateOne(
                {"classe.0.nom": classe, name: departe ,},
                {
                  $push : { "classe.0.etudiant": { "Nom": Nom,
                  "Matricule": monmatricule,
                  "telephone": telephone,
                  "Motdepasse": hash,
                  "note": []
                }}
                }
              )  })
              var lesmatiere = [];  
              var tableau = Array();   
              matiere.find({"name": request.body.departe, "classe.0.nom": classe}).toArray(function (err, cours) {
                
                for (var i = 0; i < cours[0]['classe'].length; i++) {
                  if (cours[0]['classe'][i].nom == classe ) {
                    mesmatiere = cours[0]['classe'][i].lesmatiere;
                    for (var k = 0; k < mesmatiere.length; k++) {
                      const element = mesmatiere[k];
                      tableau.push(element)
                      
                    }
                    //console.log(mesmatiere)
                  }
                }
                  
              console.log(tableau)      
              //stockage des informations dans les sessions
              response.cookie('nom', Nom);
              response.cookie('monmatricule', monmatricule);
              response.cookie('classe', classe);
              response.cookie("departe", departe)
              response.cookie("mesmatiere", tableau)
              response.locals.nom = Nom;
              response.locals.matricule = monmatricule;
              response.locals.classe = classe;
              response.locals.mesmatiere = tableau;
              response.locals.departe = departe;
              response.redirect("/lescours")
            })    
              
             }
            
         
        })
  
        })  
       
      
     }
   }
  ]
 