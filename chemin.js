var express = require('express');
var router = express.Router();


//les controleurs
var actue = require('./controleurs/page/actualite');
var espacecompte = require("./controleurs/page/espacecompte");
var espaceclasse = require("./controleurs/page/espaceclasse")
var espaceprofs = require("./controleurs/profs/creation")
var forumprofs = require("./controleurs/profs/forumprofs")




//les routes 
router.get('/', actue.lien)
router.get('/critereinscrit', (request, response) =>{
    response.render('page/critereinscrit')
})
router.get('/mensualite', (request, response) =>{
    response.render('page/mensualite')
})
router.get('/reglement', (request, response) =>{
    response.render('page/reglement')
})
router.get('/valeur', (request, response) =>{
    response.render('page/valeur')
})
router.get('/contact', (request, response) =>{
    response.render('page/contact')
})
router.get('/bts', (request, response) =>{
    response.render('page/bts')
})
router.get('/universite', (request, response) =>{
    response.render('page/universite')
})
router.get('/espace', (request, response) =>{ //lien pour consulter la partie espace d'apprentissage
    //b-smart-edu
     //si ma variable session n'existe on redirect a la pages forum
     if (request.cookies.nom && request.cookies.monmatricule) {//si le kokie existe on l'envoie a la page des cours
        response.render('page/lescours', {nom: request.cookies.nom , mesmatiere: request.cookies.mesmatiere, matricule: request.cookies.monmatricule, classe: request.cookies.classe, departe: request.cookies.departe  })
    } else {//si le kokie n'existe pas on envoie a la page d'authentification
        response.render('page/espace')
    }
           
})
router.get('/formation', (request, response) =>{
    response.render('page/formation')
})
router.get('/statistique', (request, response) =>{
    response.render('page/statistique')
})
router.get('/emplois', (request, response) =>{
    response.render('page/emplois')
}) 
router.get('/bibliotheque', (request, response) =>{
    response.render('page/bibliotheque')
}) 
router.get('/actualite', (request, response) =>{
    response.render('page/actualite')
}) 
router.get('/actualite/:id', actue.actualite) 
router.get('/creercompteetu', (request, response) =>{
    response.render('page/creercompteetudiant')
}) 
router.post('/creationcompte', espacecompte.creer) 
router.get('/lescours', espacecompte.verificationredirect) 
router.post('/connection', espacecompte.connection) 
router.get("/espaceclasse/:departe/:classe/:cour", espaceclasse.classe )
router.get("/espacecours/:departe/:classe/:cour", espaceclasse.cours )
router.get('/espacecourssous/:departe/:classe/:idmatiere/:idchapitre/:id', espaceclasse.souschapitre)
router.get('/espaceforum/:departe/:classe/:cour', espaceclasse.discution)  
router.get('/espacerepondre/:departe/:classe/:cour/:id', espaceclasse.reponsedunediscute)
router.post('/espacerepondrediscution', espaceclasse.repondrequestion) 
router.get('/reponsequestion', espaceclasse.redirectreponse) 
router.get('/espacenouvosujet/:departe/:classe/:cour', (request, response) =>{
    response.cookie('classe', request.params.classe);
    response.cookie('cour', request.params.cour);
    response.cookie('departe', request.params.departe);
    response.render('page/espacenouvosujet', {nom: request.cookies.nom , mesmatiere: request.cookies.mesmatiere, matricule: request.cookies.monmatricule, classe: request.cookies.classe , departe: request.cookies.departe })
})
router.post('/poserquestion', espaceclasse.poser) 
router.get('/posequestion', espaceclasse.poserredirect) 
router.post('/contacter', espaceclasse.contacte)


//les liens des pages coter proffesseurs
router.get('/profs/', (request, response) =>{
    if (request.cookies.nom && request.cookies.identifiant) {//si le kokie existe on l'envoie a la page des cours
    response.locals.nom = request.cookies.nom;
    response.locals.identifiant = request.cookies.identifiant;
    response.locals.coursenseigner = request.cookies.coursenseigner;
    response.locals.telephone = request.cookies.telephone;
        response.render('profs/index')
} else {//si le kokie n'existe pas on envoie a la page d'authentification
response.render('profs/login')
}
})
router.get('/profs/creation', (request, response) =>{
    response.render('profs/creer')
})
router.post('/profs/connection', espaceprofs.creer)  
router.get('/profs/authentifieprofs', espaceprofs.authentifiredirect)
router.post('/profs/verification', espaceprofs.verification)
router.get('/profs/forum/:departe/:classe/:cour/', forumprofs.forum)
router.get('/profs/forumdetails/:departe/:classe/:cour/:id', forumprofs.reponsedunediscute)
router.post('/profs/forumrepondrediscution', forumprofs.repondrequestion) 
router.get('/profs/reponsequestion', forumprofs.redirectreponse) 
router.get('/profs/forumnouvosujet/:departe/:classe/:cour', (request, response) =>{
    response.cookie('classe', request.params.classe);
    response.cookie('cour', request.params.cour);
    response.cookie('departe', request.params.departe);
    response.render('profs/forumnouvosujet', {nom: request.cookies.nom , mesmatiere: request.cookies.mesmatiere, matricule: request.cookies.monmatricule, classe: request.cookies.classe , departe: request.cookies.departe })
}) 
router.post('/profs/poserquestion', forumprofs.poser) 
router.get('/profs/posequestion', forumprofs.poserredirect) 
router.get('/profs/compte', (request, response) =>{
    response.render('profs/compte', {nom: request.cookies.nom ,identifiant: request.cookies.identifiant, departe: request.cookies.departe, telephone: request.cookies.telephone , coursetclasse: request.cookies.coursetclasse })
}) 
router.get('/profs/acceuil', (request, response) =>{  
response.locals.nom = request.cookies.nom;
response.locals.identifiant = request.cookies.identifiant;
response.locals.coursenseigner = request.cookies.coursenseigner;
response.locals.telephone = request.cookies.telephone;
    response.render('profs/index')
}) 
module.exports = router;