//! SOAP i REST apinja
//! SOAP - XML za transfer
//! REST - XML i JSON za transfer
//! APIs - Application Programming interface
//! REST - Representational state transfer
//! NPM INSTALL DOTENV

//! process.env e mesto kade sto nasata aplikacija zivee(okolina)

//! JWT - JSON WEB TOKEN
//* sekogash e statless
//! Logiranje - koga korisnikot se logira, serverot proveruva akreditacija i generira json web token
//! Avtorizacija - odkoga korisnikot veke se logiral aplikacijata mu go vraka nazad tokenot pak do korisnikot vo forma na kukis ili korisnikot go zacuvuva vo forma na lokalen storage
//! Verifikacija - koga korisnikot ima rikvest kon serverot so jwt tokenot, serverot prvo go verifikuva potpisot od tokenot potoa serverot proveruva dali korisnikot ima dozvola da ja zeme povratnata usluga od rikvestot ili pobaruvanjeto znaci ako potpisot e validen togas korisnikot uspesno ja dobiva uslugata od rikvestot

/////////////////////////////

//* JWT ima tri dela
//-header = cuva informacii za algoritmot koj e upotreben za da se logirame
//-payload = zacuvuvame podatoci od korisnikot i koga e izdaden
//-signature = koj go socinuva hasiraniot header i payload i e potpisan so taen kluc koj sto go znae samo serverot

//? gi povikuvame paketite
//* Vo ovaa linija kod vo vcituvame modulot "express" koj se koristi za kreiranje na web aplikacii so koristenje na Node.js
const express = require("express");
//* Ovaa linija kod e takanarecena "relativna pateka" vo Javascript i se koristi za vcituvanje na modulot ili datotekata na drugo mesto vo proektot. Vo ovoj slucaj go vcituvame modulot "index" od folderot "db", koj pak se naoga vo folderot "pkg" 
const db = require("./pkg/db/index");
//* npm install express-jwt
//* Ovaa linija kod go vcituva modulot "express-jwt" vo programata
//* "express-jwt" e modul koj obezbeduva mehanizam za avtentikacija i avtorizacija na korisnicite vo Express.js web aplikacii koristejki JSON Web Tokens
const jwt = require("express-jwt");
//* npm install cookie-parser
//* Ovaa linija na kod go vcituva modulot "cookie-parser" vo programata
//* "cookie-parser" e modul koj obezbeduva funkcionalnost za obrabotka na HTTP kolacinja vo Express.js web aplikacii
const cookieParser = require("cookie-parser");

//* So ovie tri linii na kod se vcituvaat modulite od razlicni folderi na nasiot proekt
const movies = require("./handlers/movies");
const authHandler = require("./handlers/authHandler");
const viewHandler = require("./handlers/viewHandler");
const moviesHandler = require("./handlers/moviesHandler");

//* Ovaa linija kreira nova ekspress aplikacija so pomos na f-jata "express()"
//* Aplikacijata se cuva vo promenlivata "app" i ovaa instanca na ekspress objektot ke se koristi za definiranje na ruti za obrabotka na HTTP baranja
const app = express();

//* Gi povikuvame middelware-ite
//* Definiranje na standardnata tehnologija za renderiranje na izgledot na nasata aplikacija
//* Vo ovoj slucaj "view engine" se postavuva na "ejs" sto znaci deka nasata aplikacija koristi EJS sabloni za generiranje na HTML izgledot
app.set("view engine", "ejs");
//* Ovaa linija na kod dodava middleware koj ovozmozuva nasata aplikacija da cita i intertretira JSON podatoci vo HTTP baranjata
app.use(express.json());
//* Ovaa linija na kod dodava middleware vo nasata aplikacija za obrabotka na podatoci prateni preku URL-enkodirani formi
app.use(express.urlencoded({ extended: true }));
//* Ovaa linija na kod dodava middleware vo nasata aplikacija za obrabotka na HTTP kolacinja
app.use(cookieParser());
//* specificirame direktorija publik za da imame pristap za fajlovi od frontend
//* static metodot ni ovozmozuva da opsluzuvame staticni fajlovi
app.use(express.static("public"));

//* Izvrsuvanje na init funkcijata so koja funkcija se konektirame so data baza
db.init();

// req.headers.authorization.split(" ")[1]; 5rasdgasdgasdgasdgasdgsgdasdg

// req.cookies = {
//   jwt: "5rasdgasdgasdgasdgasdgsgdasdg",
// };

//* Ovde koristime middelware sto ni ovozmozuva da gi protektirame rutite, kako prv parametar imame jwt.expressjwt , vnatre go stavame algoritmot za hasiranje i tajnata poraka i so pomos na ovoj middelware gi protektirame site ruti osven onie ruti koi se vo unless metodata
//* Potoa preku getToken se proveruva dali JWT se dostavuva preku Authorization so semata Bearer
//* Ako ne se naoga vo zaglavieto Authorization se proveruva dali e dostapen so kolace so ime jwt
//* Ako JWT ne se naoga ni vo Authorization, nitu vo kolaceto se vraka null
app.use(
  jwt
    .expressjwt({
      algorithms: ["HS256"],
      secret: process.env.JWT_SECRET,
      getToken: (req) => {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          return req.headers.authorization.split(" ")[1];
        }
        if (req.cookies.jwt) {
          return req.cookies.jwt;
        }
        return null; // vo slucaj ako nemame isprateno token
      },
    })
    .unless({
      // osven ovie ruti
      path: [
        "/api/v1/signup",
        "/api/v1/login",
        "/login",
        "/movies",
        "/movies/:id",
      ],
    })
);

app.post("/api/v1/signup", authHandler.signup);
app.post("/api/v1/login", authHandler.login);

app.get("/movies", authHandler.middelwareTest, movies.getAll);
app.get("/movies/:id", movies.getOne);
app.post("/movies", movies.create);
app.put("/movies/:id", movies.replace);
app.patch("/movies/:id", movies.uploadFilmsPhotos, movies.update);
app.delete("/movies/:id", movies.delete);

app.get("/me", movies.getByUser);
app.post("/createuser", movies.createByUser);

//* view ruti
app.get("/viewMovies", viewHandler.movieView);
app.get("/login", viewHandler.getLoginForm);
app.post("/createMovie", viewHandler.createMovie);
app.get("/deleteMovie/:id", viewHandler.deleteMovie);
// app.post("/deleteMovie/:id", viewHandler.deleteMovie);
app.get("/viewMovies/:id", viewHandler.viewMovieDetails);
app.post("/modifyMovie/:id", viewHandler.modifyMovie);

//* Slusame aplikacija
app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log("Could not start service");
  }
  console.log(`Service started successfully on port ${process.env.PORT}`);
});

//? DA SE KE KREIRA WEB SERVIS ILI REST API
//? DA SE KREIRA OGLAS
//? KAKO REKLAMA5
//? I DA SE KREIRA AFTENTIKACIJA (korisnici - logirtanje)
//? DA IMAME KOLEKCIJA SO AVTOMOBILI, VELOSIPEDI, NEDVIZNINI, TELEFONI
//? SITE KORISNICI BEZ RAZLIKA NA LOGIRANJE DA IMMAT PRISTAP DO SITE KOLEKCII
//? SAMO LOGIRANI KORISNI DA MOZE DA KREIRAAT BRISHAT I UPDEJTIRAAT DOKUMENTI VO KOLKECIITE

//!
//? ZA DOMASNA DA SE IMMPLEMENTIRA OGLASI, da moze sekoj korisnik da si kreira sopstveni oglasi
//? isto taka sekoj korisnik da moze da gi vidi samo sopstvenite oglasi
//? bonus: se sto imame uceno implementirajte

//!
//? app.get("/movies/:id", movies.getOne);
//? da se prikazat 3 filma, znaci da se implementira multer so koj kje mozeme da prikacime 3 sliki