//* Ovaa linija kod definira modificirana verzija na f-jata "fetch" koja se koristi za pravenje HTTP baranja vo Javascript aplikacii
//* Ovaa modifikacija vklucuva koristenje na "import("node-fetch") za vcituvanje na modulot "node-fetch"
//* "fetch = ( ...args) =>" -  Ovaa sintaksa gi koristi argumentite na f-jata "fetch" kako parametri
//* "import("node-fetch") - Ova e dinamicko vcituvanje na modulot
//* ".then(({ default: fetch }) => fetch(...args))" - Po uspesnoto vcituvanje na modulot, ".then" metodot se povikuva i prenesuva objekt vo koj imeto "default" od objektot se prisvojuva na promenlivata "fetch"
//* "import" go vraka celiot modul kako objekt i edna od negovite svojstva e "default"
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

//! npm install node-fetch@^2.6.6

// app.get("/api/v1/weather/:city", weather.getCity);

//* Ovaa linija kod kreira objekt "cache" (kes) koj moze da se koristi za zacuvuvanje na podatoci vo memorijata
//* Kesot obicno se koristi za zacuvuvanje rezultati od skapi operacii ili podatoci koi se koristat cesto, so cel da se podobri performansata i da se namali vremeto potrebno za dobivanje na podatocite 
let cache = {};

//* "getCity" e asinhrona f-ja sto znaci deka koristi "async" i moze da izvrsuva operacii koi se asinhroni (kako HTTP baranja) bez da go blokiraat izvrsuvanjeto
//* "key" e API klucot za OpenWeather API, koj ke bide koristen vo formiranjeto na URL-to za baranjeto kon API
//* "url" e URL-to za baranje kon OpenWeather API. Gradot koj se bara se prenesuva kako parametar vo URL-to
const getCity = async (req, res) => {
  let key = "febc5153c18b6e7dde8ad46b218279c8";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${key}`;

  // let data = await fetch(url);
  // let weatherData = await data.json();
  // res.send(weatherData);
  const cache = {
    ohrid: {
      localCache: {},
      cacheTime: 1692992486658,
    },
    skopje: {
      localCache: {},
      cacheTime: 1692992504464,
    },
  };
  // test["ohrid"]
  //* Ovie linii na kod sluzat za proverka i presmetuvanje na lokalniot kes ("localCache") na podatoci vo slucaj koga istite treba da se osvezat ili zamenat so novi informacii
  //* "cache[req.params.city]" - se obiduva da pristapi do kesot za odredeniot grad
  //* "cache[req.params.city].cacheTime !== null" - proveruva dali vo kesot ima informacii za vremeto na cuvanje na podatocite. Ako nema, toa znaci deka nema zacuvani podatoci vo kesot
  //* "cache[req.params.city].cacheTime + 60 * 1000 < new Date().getTime()" - proveruva dali vremeto od poslednoto cuvanje na podatocite vo kesot e pogolemo od 60 sek (1 min). Ako pominalo poveke od 1 min, togas podatocite vo kesot treba da bidat osvezeni
  //* "cache[req.params.city].localCache = null" - ako podatocite treba da se osvezat, se postavuva "localCache=null", sto znaci deka kesot za gradot e isciten i podatocite treba da se zamenat so novi
  //! So ovoj if proveruvame dali e zastarena datata, i posle kolku vreme da se brise datata
  if (
    //! dali imame vo kesot kluc so imeto na gradot
    cache[req.params.city] &&
    //! dali vo objektot sto imame kluc i vremeto cacheTimeot ne e null
    cache[req.params.city].cacheTime !== null &&
    //! ako ne e null i  vremeto cacheTime < segasnoto za 60 sekundi izbrisi gi podatocite za toj grad
    cache[req.params.city].cacheTime + 60 * 1000 < new Date().getTime()
  ) {
    cache[req.params.city].localCache = null;
  }

  //* "!cache[req.params.city] || cache[req.params.city].localCache === null" - proveruva dali nema zacuvano podatoci vo kesot za odredeniot grad, ili ako ima podatoci proveruvame dali "localCache === null". Ako uslovot e ispolnet, toa znaci deka podatocite ne s zacuvani ili zacuvanite podatocite se stari i treba da se zamenat
  //* "let data = await fetch(url);" - pravi HTTP baranje do OpenWeather API za da dobie svezi informacii za vremeto i gradot
  //* "cache[req.params.city] = { ... }" - kreira nov objekt vo kesot za gradot. Vo ovoj objekt se zacuvuvaat novite informacii za bremeto kako "localCache", a "cacheTime" go postavuva momentalnoto vreme
  //* "return res.send(cache);" - go vraka celiot kes kako odgovor na baranjeto 
  //! ako nemame grad vo kesot ili ako gradot so localCache = null  togas da se refetceneme so weather api
  if (!cache[req.params.city] || cache[req.params.city].localCache === null) {
    let data = await fetch(url);
    cache[req.params.city] = {
      localCache: await data.json(),
      cacheTime: new Date().getTime(),
    };
  }
  return res.send(cache);
};

module.exports = {
  getCity,
};

//? DOMASNA
//? - Преземање на податоци од RickN'Morty API-то и локално кеширање на податоците
