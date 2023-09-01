//* Ovoj red go vcituva modulot "form-data" koj se koristi za sozdavanje i manipulacija so formiranje na podatoci vo HTTP baranja
const formData = require("form-data");
//* Ovoj red go vcituva modulot "mailgun.js" koj se koristi za interakcija so Mailgun API. Mailgun e servis za isprakanje na e-poraki
const Mailgun = require("mailgun.js");
//* Ovoj red kreira nova instanca na Mailgun koristejki go modulot "mailgun.js" i istancata "formData"
//* Ovaa istanca na "mailgun" se koristi za izvrsuvanje na razlicni operacii povrzani so Mailgun API
const mailgun = new Mailgun(formData);
//* Kreiranje na Mailgun klient so API kluc
//* Ovoj red kreira Mailgun so korisnicko ime "api" i private API kluc ("<PRIVATE_API_KEY>")
//* Ova se koristi pri komunikacija so Mailgun API
const mg = mailgun.client({
  username: "api",
  key: "<PRIVATE_API_KEY>",
});

//* Ovaa f-ja narecena "sendMailGun" sluzi za isprakanje na e-poraki koristejki Mailgun servis
const sendMailGun = async (options) => {
  //* 1) Definirame e-mail opcii
  //* Vo ovoj del se definiraat opciite na e-porakata koja ke se isprati. Opciite se cuvaat vo objektot "emailData"
  //* Ovie opcii vklucuvaat "from": e-adresata na isprakacot, "to": e-adresata na primacot, "subject": predmet na porakata (naslovot) i "text": sodrzinata na porakata
  const emailData = {
    from: "Mailgun Sandbox <postmaster@sandboxfd700b0f92fd4c6284f578953b4de2f4.mailgun.org>",
    to: options.email,
    subject: options.subject,
    text: options.messages,
  };

  //* 2) Isprakame e-mail koristejki Mailgun
  //* Vo ovoj del se koristi "mg.messages.create" metodot za kreiranje i isprakanje na e-porakata koristejki go Mailgun servisot
  //* Metodot prifaka dva argumenti: imeto na domenot na Mailgun smetkata od koja sakate da ispratite poraki i "emailData" koja sodrzi informacii za porakata koja sakate da ja ispratite
  await mg.messages.create(
    "sandboxfd700b0f92fd4c6284f578953b4de2f4.mailgun.org",
    emailData
  );
};