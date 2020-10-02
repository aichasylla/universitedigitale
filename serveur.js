const { request, response } = require('express')

let express = require('express')
let app = express()
var router = express.Router();
let bodyParser = require('body-parser') //permet de parser les donner envoyer par posts
let session = require("express-session") //permet d'appeler la session
let cookieParser = require('cookie-parser')
var compression = require('compression');
//nos moteur de templates 
app.set('view engine', 'ejs')
//nos middleware
app.use('/assets', express.static('public')) //le dossier servant a distribuer les css
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(session({ // le middleware de session
    secret: "aaaaweeeeeeeeeee",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}))
app.use(cookieParser())
//app.use(require('./middleware/flash'))

app.use(compression()); //Compress all routes
app.disable('x-powered-by');


//router
var lien = require('./chemin.js');
// ...
app.use('/', lien);
app.listen(process.env.PORT || 8181, function(){
    console.log('Server is listening on *:8181');
  });