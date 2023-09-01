const User = require("../pkg/user/userSchema");
//* npm install jsonwebtoken
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("./emailHandler");
const sendMailGun = require("./mailgun");

exports.signup = async (req, res) => {
  try {
    // kreirame korisnik, kako input kreirame nas objekt
    // zaradi pogolema bezbednost
    // i sanatizacija na kodot
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // da generiraame token
    // kako prv parametar e payloadot, vtor parametar e tajnata recinica i kako tret rokot na istek
    const token = jwt.sign(
      { id: newUser._id, name: newUser.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    // res.cookie ima tri parametri, prviot so kako se vika kukisot, vtoriot vrednosta na kukisot i tretiot parametar dodatni opcii
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: true,
    });

    await sendEmail({
      email: newUser.email,
      subject: "Blagodarnica",
      message: "Vi blagodarime na izbranata doverba",
    });

    await sendMailGun({
      email: newUser.email,
      subject: "Blagodarnica",
      message: "Vi blagodarime na izbranata doverba",
    });

    // res.status ni vraka token status i korisnikot
    res.status(201).json({
      status: "success",
      // token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Proveruvame dali ima vneseno password i email
    if (!email || !password) {
      return res.status(400).send("Please provide email and password!");
    }
    // 2. Proveruvame dali korisnikot postoi
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send("This user with this e-mail doest exist in database");
    }

    // 3. Sporeduvame password
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send("INVALIDDD PASSSWORRDDD!");
    }

    // 4. Se generira tokenot so sign metoda
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    // 5. Go isprakame cookisot so tokenot
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: true,
    });

    // 6. go isprakjame tokenot
    res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Go zemame tokenot i proveruvame dali e tamu
    // console.log(req.headers);
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }
    // console.log(token);

    if (!token) {
      return res.status(500).send("You are not logged in! please log in");
    }
    // 2) Go verificirame tokenot
    // promisot kje bide ili succes vrednost ili rejected kje ni frli error

    //! prv nacin
    // function verifyToken(token) {
    //   return new Promise((resolve, reject) => {
    //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //       if (err) {
    //         reject(new Error("Token verification failed"));
    //       } else {
    //         resolve(decodedToken);
    //       }
    //     });
    //   });
    // }

    // //!vtor nacin
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // 3) Proveruvame korisnikot dali postoi
    const userTrue = await User.findById(decoded.id);
    if (!userTrue) {
      return res.status(401).send("User doenst longer exist!");
    }

    // Davame dozvola za protektiranata ruta
    req.auth = userTrue;

    next();
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

exports.middelwareTest = (req, res, next) => {
  console.log("This is middelawre");
  req.semos = "WELCOME TO BACKEND";

  next();
};