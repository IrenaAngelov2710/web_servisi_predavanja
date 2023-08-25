const Movie = require("../pkg/movies/moviesSchema");
const moviesHandler = require("./moviesHandler");

//* Kreiranje na nov dokument vo kolekcijata
const createMovie = async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.send(newMovie);
    }
    catch(err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
};

//* Prikazuvanje na site dokumenti vo kolekcijata
const getAllMovies = async (req, res) => {
  try {
    console.log(req.query);
    // pravime kopija od objektot ne sakame da go modificirame originalnoto query
    const queryObj = { ...req.query };
    // ovoj objekt go konvertirame vo string
    let queryString = JSON.stringify(queryObj);
    // go modificirame stringot
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // od koga ke go modificirame go vrakame nazad vo objekt
    const query = JSON.parse(queryString);
    // so find metodagta gi zemame site dokumenti od edna kolekcija
    const movies = await Movie.find(query);
     
    res.status(200).json({
      status: "Success",
      data: {
        movies: movies,
      },
    }); 
  }
  catch(err){
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

//* Prikazuvanje na eden dokument od kolekcijata po ID
const getOneMovie = async (req, res) => {
    try {
        console.log(req.params);
        const movie = await Movie.findById(req.params.id);

        res.status(200).json({
            status: "Success",
            data: {
                movie,
            },
        });
    }
    catch(err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

//* Promena nekoja vo dokument od kolekcijata po ID
const updateMovie = async (req, res) => {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      res.status(200).json({
        status: "success",
        data: {
          updatedMovie,
        },
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err,
      });
    }
  };

  //* Brisenje na nekoj dokument od kolekcijata po ID
  const deleteMovie = async (req, res) => {
    try {
      await Movie.findByIdAndDelete(req.params.id);
  
      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (err) {
      res.status(404).json({
        status: "fail",
        message: err,
      });
    }
  };

  module.exports = {
    createMovie,
    getAllMovies,
    getOneMovie,
    updateMovie,
    deleteMovie
  };