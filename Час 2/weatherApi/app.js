//! npm install node-fetch = so node-fetch vrsime interakcija so drugi web servisi
//! npm install express

//* So ovaa linija na kod go vnesuvame modulot "express" vo Node.js aplikacijata
//* "express" e popularen web-frejmvork za Node.js koj ovozmozuva kreiranje na web aplikacii i API na ednostaven i efikasen nacin
const express = require("express");
//* Ovaa linija kod go vklucuva lokalniot modul "weather" vo nasiot proekt
//* Koristenjeto na "require("./handlers/weather)" ja pottiknuva Node.js da go vcita modulot koj se naoga vo direktorijata "handlers" i imeto na modulot e "weather.js"
const weather = require("./handlers/weather");

//* So ovaa linija kod kreirame nova istanca na "express" aplikacijata
const app = express();

//* Ovaa linija kod definira ruta vo Express aplikacijata koja se odnesuva na HTTP GET baranje na patekata "/api/v1/weather/:city"
app.get("/api/v1/weather/:city", weather.getCity);

//* Slusame aplikacija
app.listen(10001, (err) => {
  if (err) {
    return console.log("Could not start a service");
  }
  console.log("service started successfully");
});
