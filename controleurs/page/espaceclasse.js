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
exports.cours = function(request, response) {
    /*
ce midelware permet d'envoyer tout les chapitre , sous -chapitre cour pdf exercie et qcm d'un cour 
donner

    */
    const MongoClient = require('mongodb').MongoClient;
    const assert = require('assert');
    //url de connection
    const url = "mongodb://localhost:27017/univ";
    //nom de la bdd
    const dbName = 'univ';
    //requette
    var lien = [];
    var chapitre = [];
    var Pdf = '';
    var souschapitre = [];
    var videos = []
    var cour =   request.params.cour ;
    var classe = request.params.classe;
    var departe = request.params.departe;
    var qcm = [];
    var question = ''
    var chapdefo = []; //definition du chapitre par defaut a afficher lorsqu'on charge la page
    var souschapdefo = [];//definition du sous chapitre par defaut a afficher
    var videodefo = '';//definition du fichier par defaut 
    //creation d'un nouveau mongoclient
    const client = new MongoClient(url ,  { useUnifiedTopology: true
    });
    //utilisation de la methode connect pour la connection au serveur
    client.connect( function (err, client) {
        assert.equal(null, err);
        
        const db = client.db(dbName);
        const col = db.collection('cours');
        col.find({"name": departe, "classe": classe}).toArray(function (err, docs) {
            lien = docs;     
            for (let i = 0; i < docs[0]['Cours'].length; i++) {
                if (docs[0]['Cours'][i]['titre'] == cour) {
                    var doc = docs[0]['Cours'][i];
                var matiere = docs[0]['Cours'][i]['titre'] 
                 for (let j = 0; j < docs[0]['Cours'][i]['video'].length; j++) {
                     const element = docs[0]['Cours'][i]['video'];
                      Pdf = docs[0]['Cours'][i]['video'][j]['Pdf'];
                     chapdefo = docs[0]['Cours'][i]['video'][0]['titre']
                     qcm = docs[0]['Cours'][i]['video'][0]['qcm'][0]['question']; //par defaut on utilise le qcm du premier chapitre
                     souschapdefo = docs[0]['Cours'][i]['video'][0]['souschapitre'][0]['titre'];//le titre du sous chapitre a envoyer pardefaut
                     videodefo = docs[0]['Cours'][i]['video'][0]['souschapitre'][0]['fichier'];//le fichier video a envoyer par defaut 
                     chapitre.push(element)
                    
                     for (let n = 0; n < docs[0]['Cours'][i]['video'].length; n++) {
                         const sous = docs[0]['Cours'][i]['video'][n]['souschapitre'];
                         const  video = docs[0]['Cours'][i]['video'][n]['souschapitre'][0]['fichier'];
                         souschapitre.push(sous);
                         videos.push(video);
                         console.log(sous.length)
                     }
                     
                     
                 } 
                 
             
                }
                
                
            }
            response.locals.nom = request.cookies.nom
            response.locals.matricule = request.cookies.monmatricule
            response.locals.classe = request.cookies.classe
            response.locals.mesmatiere = request.cookies.mesmatiere
            response.locals.departe = request.cookies.departe
 response.render('page/espacecours',  { reponse: matiere, laclasse: classe, chapitre: chapitre, souschapitre: souschapitre, chapdefo: chapdefo, souschapdefo: souschapdefo, chapdefo: chapdefo, videodefo: videodefo , qcm: qcm, Pdf: Pdf})
        })
        
    })
 //connection with mongoDB


}
exports.classe = function (request, response) {
    /*
 permet d'accer au forum classe
    */
    var cour =   request.params.cour ;
    var classe = request.params.classe;
    var departe = request.params.departe
    
    response.locals.nom = request.cookies.nom
    response.locals.matricule = request.cookies.monmatricule
    response.locals.classe = request.cookies.classe
    response.locals.departe = request.cookies.departe
    response.render('page/espaceclasse',  { cour: cour, classe: classe , departe: departe})
}
exports.discution = function(request, response) {
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
            response.locals.matricule = request.cookies.monmatricule
            response.locals.classe = request.cookies.classe
            response.locals.mesmatiere = request.cookies.mesmatiere
            response.locals.departe = request.cookies.departe
            response.render('page/espaceforum',  { reponse: cour, laclasse: classe, question: question}) 
        })
        
    })
 //connection with mongoDB


}
exports.souschapitre = function(request, response) {
    /*
il permet d'envoyer les chapitres les sous-chapitre les qcm et pdf d'un cour .
elle est activer lorsque on clique sur un sous chapitre

    */
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
    var matiere = [];
    //forum discution 
    var question = '' ; //les question poster
    
    var chapitre = [];
    var Pdf = '';
    var souschapitre = [];
    var videos = [];
    var classe =  request.params.classe
    var hj =   request.params.idmatiere;
    var sousmatiere = request.params.id;
    var lechapitre = request.params.idchapitre;
    var departe = request.params.departe;
    var qcm = '';
    var doc = []
    var fichier = []
    //creation d'un nouveau mongoclient
    const client = new MongoClient(url ,  { useUnifiedTopology: true });
    
    //utilisation de la methode connect pour la connection au serveur
    client.connect( function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        const col = db.collection('cours'); 
        col.find({"name": departe, "classe": classe}).toArray(function (err, docs) {
            lien = docs;
            for (let i = 0; i < docs[0]['Cours'].length; i++) {
                if (docs[0]['Cours'][i]['titre'] == hj) {
                    var doc = docs[0]['Cours'][i];
                var matiere = docs[0]['Cours'][i]['titre']
                 for (let j = 0; j < docs[0]['Cours'][i]['video'].length; j++) {
                     const element = docs[0]['Cours'][i]['video'];
                    
                     
                     chapitre.push(element)
                    
                     for (let l = 0; l < docs[0]['Cours'][i]['video'].length; l++) {
                         const sous = docs[0]['Cours'][i]['video'][l]['souschapitre'];
                         const  video = docs[0]['Cours'][i]['video'][j]['souschapitre'][0]['fichier'];
                         var z = docs[0]['Cours'][i]['video'][j]['souschapitre'];
                         for (let e = 0; e < z.length; e++) {
                             if ( docs[0]['Cours'][i]['video'][j]['souschapitre'][e]['titre'] === request.params.id ) {
                                var fichier = docs[0]['Cours'][i]['video'][j]['souschapitre'][e]['fichier'];
                                 qcm = docs[0]['Cours'][i]['video'][j]['qcm'][0]['question'];
                                Pdf = docs[0]['Cours'][i]['video'][j]['Pdf'];
                            
                             }
                         }
                         
                        
                         souschapitre.push(sous);
                         videos.push(video);
                         
                     }
                     
                     
                 } 
                 
             
                }
                
                
            }
          response.locals.nom = request.cookies.nom
          response.locals.matricule = request.cookies.monmatricule
          response.locals.classe = request.cookies.classe
          response.locals.mesmatiere = request.cookies.mesmatiere
          response.locals.departe = request.cookies.departe;
 response.render('page/espacecours',  { reponse: matiere, laclasse: classe,requette: hj, chapitre: chapitre, souschapitre: souschapitre, lechapitre: request.params.idchapitre, sousmatiere: request.params.id , video: fichier, qcm: qcm,  Pdf: Pdf , question: question})
        })
        
    })

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
    response.cookie('cour', cour);
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
            response.locals.matricule = request.cookies.monmatricule
            response.locals.classe = request.cookies.classe
            response.locals.mesmatiere = request.cookies.mesmatiere
            response.locals.departe = request.cookies.departe
        response.render('page/espacerepondre', { question: question, lesreponse: lesreponse});
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
     response.render('page/espacerepondre', { question: question, lesreponse: lesreponse});   
 })
 
    
 response.locals.nom = request.cookies.nom
 response.locals.matricule = request.cookies.monmatricule
 response.locals.classe = request.cookies.classe
 response.locals.mesmatiere = request.cookies.mesmatiere
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
                "pseudo": pseudo,
                "reponse": message,
                "date": new Date()
              }}
        }
        const result =  rp.updateOne(query, updateDocument);
           
        response.locals.nom = request.cookies.nom
        response.locals.matricule = request.cookies.monmatricule
        response.locals.classe = request.cookies.classe
        response.locals.mesmatiere = request.cookies.mesmatiere
        response.locals.departe = request.cookies.departe
        response.redirect("/reponsequestion");
       
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
       
           response.render('page/espacerepondre', { question: question, lesreponse: lesreponse});   
       })
       
       response.locals.nom = request.cookies.nom
       response.locals.matricule = request.cookies.monmatricule
       response.locals.classe = request.cookies.classe
       response.locals.mesmatiere = request.cookies.mesmatiere
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
      response.locals.matricule = request.cookies.monmatricule
      response.locals.classe = request.cookies.classe
      response.locals.mesmatiere = request.cookies.mesmatiere
      response.locals.departe = request.cookies.departe
      response.render('page/espacenouvosujet')
      
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
                     "pseudo": pseudo,
                     "date": new Date(),
                     "reponse": []
                   }}
             }
              rp.updateOne(query, updateDocument);
             
            response.locals.nom = request.cookies.nom
            response.locals.matricule = request.cookies.monmatricule
            response.locals.classe = request.cookies.classe
            response.locals.mesmatiere = request.cookies.mesmatiere
            response.locals.departe = request.cookies.departe
            response.redirect('/posequestion')
       
      
            
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
      response.locals.matricule = request.cookies.monmatricule
      response.locals.classe = request.cookies.classe
      response.locals.mesmatiere = request.cookies.mesmatiere
      response.locals.departe = request.cookies.departe
  response.render('page/espaceforum',  { reponse: cour, laclasse: classe, question: question})
  
  })
   
  }) 
  
  
  }
  exports.contacte = [ //verification de l'email
  // verifie si le matricule est un nombre.
  body('nom', "veuillez bien saisir un nom").isLength({min: 1}).trim(),
  body('prenom', "veuillez bien saisir un prenom").isLength({min: 1}).trim(),
  body('telephone').matches(/^6[2,5,6]{1}[0-9]{7}$/).withMessage('Veuilez bien saisir un numero valide').trim(),
  body('message', "veuillez bien saisir un message").isLength({min: 1}).trim(),
  body('sujet', "veuillez bien saisir un message").isLength({min: 1}).trim(),
  body('email', "veuillez saisir un email valide").isEmail().normalizeEmail(),
  (request, response, next) => {

   // Extract the validation errors from a request.
  const errors = validator.validationResult(request);
   // Create a genre object with escaped and trimmed data
  if (!errors.isEmpty()) {
      var erreur = errors.array();
       response.render('page/contact', { erreur: erreur});
    } else{
      
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
            assert.equal(null, err);
            //console.log('connecter corectement');
            const db = client.db(dbName);
            const email = db.collection('contacte');
            var mail = request.body.email; 
            var nom = request.body.nom; 
            var prenom = request.body.prenom; 
            var message = request.body.message; 
            var sujet = request.body.sujet; 
            var telephone = request.body.telephone;
            email.updateOne(
                { name: "contacter"},
                {
                    $push : { commentaire :  { "nom": nom,
                    "prenom": prenom,
                    "email": mail,
                    "telephone": telephone,
                    "sujet": sujet,
                    "message": message
                  }}
                }
              ) 
   
        
        }
        )
        response.redirect('/')
             
    }
   
 }
]