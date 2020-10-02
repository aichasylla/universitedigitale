
let express = require('express')
let app = express()
let bodyParser = require('body-parser') //permet de parser les donner envoyer par posts
let session = require("express-session") //permet d'appeler la session
const validator = require('express-validator');
const bcrypt = require("bcryptjs")//permet de hacher le mot de passe
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
// Handle Genre create on POST.

  exports.creer =  [
      
   // verifie si le matricule est un nombre.
   body('nom').isString().withMessage('Veuilez bien saisir des caracteres aplhabetique').isLength({min: 3}).withMessage("veuillez saisir un nom de plus de 3 caractere ").trim(),
   body('identifiant').isNumeric().withMessage('Veuilez bien saisir un nombre').isLength({ min: 6, max:6}).withMessage('Veuilez bien saisir un identifiant de 6 caractere').trim(),
   body('telephone').isNumeric().withMessage('Veuilez bien saisir un nombre').matches(/^6[2,5,6]{1}[0-9]{7}$/).withMessage('Veuilez bien saisir un numero valide').trim(),
   body('motdepasse').isLength({ min: 4 }).withMessage('Veuillez saisir un mot de passe de plus de quatre caractere').trim(),
   body('motdepasse').custom((value, { req }) => {
    if (value !== req.body.motdepasse1) {
      throw new Error('les mots de passe ne sont pas identique');
    }
    
    // Indicates the success of this synchronous custom validator
    return true;
  }),
  
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
       console.log(erreur)
       response.render('profs/creer', { erreur: erreur});
       
       return;
     }else {
      const MongoClient = require('mongodb').MongoClient;
      const assert = require('assert');
      //url de connection
      const url = "mongodb://localhost:27017/univ";
      //nom de la bdd
      const dbName = 'univ';
      //creation d'un nouveau mongoclient
      const client = new MongoClient(url ,  { useUnifiedTopology: true });
      
      var lesmatiere = '';
      var profde = '';
      //utilisation de la methode connect pour la connection au serveur
      client.connect( function (err, client) {
          assert.equal(null, err);
          //console.log('connecter corectement');
          const db = client.db(dbName);
          const identifier = db.collection('proffesseuridentifier');
          const inscrit = db.collection('proffesseursinscrit');
          var nom = request.body.nom;
          var Nom = nom.toLowerCase();
          var identifiant = parseInt(request.body.identifiant);
          var telephone = request.body.telephone;
          var motdepasse = request.body.motdepasse;
          identifier.find({"name": "proffesseur"}).toArray(function (err, discut) { 
            for (let i = 0; i < discut[0]['profs'].length; i++) {
               if (discut[0]['profs'][i].Nom == Nom && discut[0]['profs'][i].Identifiant == parseInt(request.body.identifiant)) {
                    nomerreur = "votre nom est correcte";
                    erreurauth.push(nomerreur)
                    lesmatiere = discut[0]['profs'][i]['coursenseigner']
               }         
              
            }
            if (isEmpty(erreurauth)) { //si les nom ou matricule ne correspond pas on envoie une erreur de non correspondance
              response.render('profs/creer', {authentifierreur: "veuillez bien saisir les informations"});
               
             }else{
              bcrypt.hash(motdepasse, 10, (err, hash) => {
                if (err) {
                  return
                }
              response.cookie('coursetclasse', coursetclasse);
              inscrit.updateOne(
                { name: "proffesseur"},
                {
                  $push : { profs : { "Nom": Nom,
                  "Identifiant": identifiant,
                  "Telephone": telephone,
                  "Motdepasse": hash,
                  "coursenseigner": lesmatiere
                }}
                }
              )  
              
    
              //stockage des informations dans les sessions
              response.cookie('nom', Nom);
              response.cookie('identifiant', identifiant)
              response.cookie('coursenseigner', lesmatiere);
              response.cookie('telephone', telephone);
              response.locals.nom = Nom;
              response.locals.identifiant = identifiant;
              response.locals.profsde = profde;
              response.locals.coursenseigner = lesmatiere;
              response.locals.telephone = telephone;
            
              response.redirect('/profs/authentifieprofs');
              
            }) }
        })
        })  
       
      
     }
   }
  ]
  exports.authentifiredirect = function (request, response) {
    /*
ce middelware permet d'acceder a  la page forumapprentissage
    */
   response.locals.nom = request.cookies.nom;
   response.locals.identifiant = request.cookies.identifiant
   response.locals.profsde = request.cookies.profsde
   response.locals.coursenseigner = request.cookies.coursenseigner
   response.locals.telephone = request.cookies.telephone
   console.log("right");
 response.render("profs/index");

  }
  exports.verification =  [
   
   // verifie si le matricule est un nombre.
   body('identifiant').isNumeric().withMessage('Veuilez bien saisir un nombre').isLength({ min: 6, max:6}).withMessage('Veuilez bien saisir un identifiant de 6 caractere').trim(),
   body('motdepasse').isLength({ min: 4 }).withMessage('Veuillez saisir un mot de passe de plus de quatre caractere').trim(),

    (request, response, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(request);
  
      // Create a genre object with escaped and trimmed data
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        var erreur = errors.array();
       
        response.render('profs/login', { erreur: erreur});
        
        return;
      }else {
     var erreurauth = []
     var nomerreur = '';
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
          const verifi = db.collection('proffesseursinscrit');
          var monidentifiant = parseInt(request.body.identifiant);
          var motdepasse = request.body.motdepasse;
          var nomprofs = '';
          var profsde = '';
          var trouve = '';
          var telephone = '';
          verifi.find({"name": "proffesseur"}).toArray(function (err, inscription) { 
            for (let i = 0; i < inscription[0]['profs'].length; i++) {
              
              if (inscription[0]['profs'][i].Identifiant == monidentifiant ) {
                  
                   bcrypt.compare(motdepasse,  inscription[0]['profs'][i].Motdepasse, function(err, isMatch) {
                    if (err) {
                      throw err
                    } else if (!isMatch) {
                      response.render('profs/login', {authentifierreur: "veuillez bien saisir les informations"})
           
                    } else {
                      nomerreur = "votre nom est correcte";
                      erreurauth.push(nomerreur)
                      nomprofs = inscription[0]['profs'][i].Nom
                      identifiant = monidentifiant;
                      profsde = inscription[0]['profs'][i].proffesseur
                      coursenseigner = inscription[0]['profs'][i].coursenseigner
                      telephone = inscription[0]['profs'][i].Telephone
              //stockage des informations dans les sessions
              response.cookie('nom', nomprofs);
              response.cookie('identifiant', identifiant)
              response.cookie('profsde', profsde);
              response.cookie('coursenseigner', coursenseigner);
              response.cookie('telephone', telephone);
              response.cookie('coursetclasse', coursenseigner);
              response.locals.nom = nomprofs;
              response.locals.identifiant = identifiant;
              response.locals.profsde = profsde;
              response.locals.coursenseigner = coursenseigner;
              response.locals.telephone = telephone;
            response.redirect('/profs/authentifieprofs');

                    }
                  })
              }  
           }
          })
          
        })  
        
             }
    }
  ];