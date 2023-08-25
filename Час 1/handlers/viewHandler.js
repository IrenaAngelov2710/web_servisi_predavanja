const Movie = require("../pkg/movies/moviesSchema");

// ovaa funkcija se izvrsuva koga ke se primi Get baranje na patekata "/login"
// "res.status(200).render("login", { title: "Login" })";" - ovaa linija ja vraka HTTP status-kod 200(OK) i prikazuva "login"
// aplikacijata sodrzi "login" sablon ("login.ejs"), koj go prikazuva obrazecot za najavuvanje
// odtamu templejtot moze da pristapi do "title" promenlivata i da ja prikaze "Login" kako naslov na stranata
// "res.status(500).send("Error")"" - ako se javi greska kontrolerot ke vrati HTTP status-kod 500 i ke isprati poraka ERROR
exports.getLoginForm = (req, res) => {
  try {
    res.status(200).render("login", {
      title: "Login",
    });
  } catch (err) {
    res.status(500).send("Error");
  }
};

// ovaa funkcija se izvrsuva koga ke se primi Get baranje na patekata "/viewMovies"
// "const movies = await Movie.find();" - ovaa linija kod se obiduva da ti pronajde site filmovi vo bazata na podatoci so koristenje na modelot "Movie"
// pred da prodolzi funkcijata koristime "await", zatoa sto "Movie.find()" moze da vrati Promise
// "res.status(200).render("viewFilms", {...});" - ako uspesno se procitaat filmovite od bazata, kontrolerot ke gi prikaze na stranata "viewFilms,ejs"
// res.status(500).send(err) - ako se javi greska kontrolerot ke vrati HTTP status-kod 500 i ke isprati err
exports.movieView = async (req, res) => {
  try {
    const movies = await Movie.find();

    res.status(200).render("viewFilms", {
      status: "success",
      naslov: "HBO",
      kategorija: "comedy",
      movies,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

// ovaa funkcija se izvrsuva koga ke se  primi POST baranje na patekata "/createMovie"
// "await Movie.create(req.body);" - ovaa linija kod sozdava nov zapis vo bazata na podatoci so koristenje na modelot "Movie". Podatocite za noviot film se zemaat od teloto na baranjeto (req.body
// "res.redirect("/viewMovies");" - ako uspesno se sozdade noviot film vo bazata na podatoci kontrolerot go prenasocuva korisnikot na patekata "/viewMovies" koja prikazuva lista so site filmovi
// "res.status(500).send(err);" - ako se javi greska kontrolerot ke vrati HTTP status-kod 500 i ke isprati err
exports.createMovie = async (req, res) => {
  try {
    await Movie.create(req.body);
    res.redirect("/viewMovies");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    console.log(req.params.id);
    const movieId = req.params.id;
    // req.params = {
    //   id: "12515135262sdfgg23",
    // };

    await Movie.findByIdAndDelete(movieId);
    res.redirect("/viewMovies");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.viewMovieDetails = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    console.log(movie);
    if (!movie) {
      res.status(404).send("Movie not found.");
    } else {
      res.status(200).render("movieDetails", {
        status: "success",
        movie,
      });
    }
  } catch (err) {
    res.status(500).send("Error with thjisd page");
  }
};

exports.modifyMovie = async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, req.body);

    res.redirect("/viewMovies/" + req.params.id);
  } catch (err) {
    res.status(500).send("Error with thjisd page");
  }
};
