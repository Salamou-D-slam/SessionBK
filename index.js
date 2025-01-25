import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// import cors from cors;

const app = express();
const port = 3000;
const saltRounds = 10;

/*
app.use(cors());  // Autorise les requêtes provenant de domaines différents
app.get('/api/data', (req, res) => {
  res.json({ message: "Hello from backend" });
});*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use(
    session ({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    }
  }
  ));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Sessions",
    password: "setifsalamou_19000",
    port: 5432,
  });
  
  db.connect();
  
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Public/HTML/index.html");});

  app.get("/connexion", (req, res) => {
    res.sendFile(__dirname + "/Public/HTML/connexion.html");});

  app.get("/inscription", (req, res) => {
    res.sendFile(__dirname + "/Public/HTML/inscription.html");});
  
  
  app.get("/deconnexion", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
  
  
  app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
      res.render("secrets.ejs");
    } else {
      res.redirect("/connexion");
    }
  });

    // Route pour vérifier l'état d'authentification
app.get('/api/auth/status', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
      res.json({ isAuthenticated: true, username: req.user.username }); // Si l'utilisateur est connecté
  } else {
      res.json({ isAuthenticated: false }); // Si l'utilisateur n'est pas connecté
  }
});
  
  app.post("/connexion", passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/connexion",
  }));
  
  app.post("/inscription", async (req, res) => {
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const username = req.body.username;
    const password = req.body.password;

  
    try {
      const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
  
      if (checkResult.rows.length > 0) {
        res.send("Email already exists. Try logging in.");
      } else {
        //hashage du password et le sauvegarder dans la base de donnée
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
          } else {
            console.log("Hashed Password:", hash);
            const result = await db.query(
              "INSERT INTO users (nom, prenom, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
              [nom, prenom, username, hash]
            );
            const user  = result.rows[0];
            req.login(user, (err) => {
              console.log(err);
              res.redirect("/secrets");
            })
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  
  
  
  
  passport.use(new Strategy(async function verify(username, password, cb) {
  console.log(username)
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, result) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      return cb(err);
    }
  }));
  
  
  
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  