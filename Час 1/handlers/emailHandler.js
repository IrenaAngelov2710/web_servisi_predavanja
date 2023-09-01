//! npm install nodemailer
//* Ovaa linija na kod go vcituva modulot "nodemailer" so pomos na komandata "require"
//* "nodemailer" e imeto na modulot (bibliotekata) koja se vcituva
//* "nodemailer" e popularen modul vo Javascript koj se koristi za prakanje na e-poraki preku SMTP (Simple Mail Transfer Protocol)
const nodemailer = require("nodemailer");

//* Ovaa Javascript f-ja narecena "sendEmail", se koristi za prakanje na e-poraki so pomos na bibliotekta "nodemailer"
const sendEmail = async (options) => {
  try {
    //* Prviot del od f-jata se odnesuva na kreiranje na transporter, sto e objekt koj se koristi za isprakanje na e-poraki
    //* Prvata opcija za konfiguracija na transporterot koristi Gmail kako servis i bara nasa e-mail adresa i lozinka za avtentikacija
    //* 1) Kreiranje na transporter

    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: "YOUR EMAIL_ADRESS",
    //     pass: "YOUR EMAIL_PASSWORD",
    //   },
    // });

    //* Vtorata opcija za konfiguracija na transporterot koristi informacii za server na e-posta (host, port, e-mail, adress i password), cii vrednosti se citaat koristejki "process.env"
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    //* "transporter.verity" e metod za proverka dali konfiguracijata e validna i dali moze da se postavi vrska so SMTP serverot
    //* Greskite se logiraat ako e neuspesno
    transporter.verify((err, succ) => {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
      }
    });

    //* Vo ovoj del se definiraat opciite za e-porakata koja ke se isprati
    //* Opciite vklucuvaat adresa na isprakacot ("from"), adresa na primacot ("to"), predmet ("subject") i tekst na porakata ("text")
    //* Vrednostite za ovie opcii se prevzemaat od objektot "options" koj se odnesuva kako agument na f-jata
    //* 2) Da gi definirame opciite na e-mailot,
    const mailOptions = {
      from: "Semos Academy <semos@academy.mk>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    //* Sekoja greska koja moze da se pojavi vo ovoj proces se logira vo konzolata koristejki "console.log"
    //* Greskite moze da se slucat vo bilo koj del od procesot na sozdavanje i isprakanje na e-porakata
    //* 3) Da go ispratime e-mailot
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;

//? Da se kreira web servis koj kje ima opcija za subscribe
//? i na sekoj subskrajbnat korisnik da mu se iprakja email, na ovoj nachin
//? naslov na emaajlot Vi blagodaram na doverbata
//? emailot da e od korisnikot
//? i porakata da e Vi blagodaram za doverbata imeto na korisnikot,i odma do imeto datumot na subskrajbot
//? da se implementira ili so mailgun ili so nodemailer znaci izborot e vash