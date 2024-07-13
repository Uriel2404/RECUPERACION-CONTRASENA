const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const fetch = require('node-fetch');
const path = require('path');

passport.use(new GoogleStrategy({
  clientID: '759364434830-lei4kb0f52vj6v426146li535nm7bkpn.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken; 
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  name: 'URIEL', 
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'build')));


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Usuario autenticado:', req.user);
    res.redirect('/profile');
  }
);

app.get('/logout', (req, res) => {
  const accessToken = req.user ? req.user.accessToken : null;
  if (accessToken) {
    fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/x-www-form-urlencoded' }
    })
    .then(() => {
      req.logout((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.redirect('/'); 
        }
        res.clearCookie('URIEL'); 
        res.redirect('http://localhost:3001/'); 
      });
    })
    .catch(err => {
      console.error('Error al revocar token de acceso de Google:', err);
      req.logout((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.redirect('/'); 
        }
        res.clearCookie('URIEL');
        res.redirect('http://localhost:3001/'); 
      });
    });
  } else {
    req.logout((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.redirect('/'); 
      }
      res.clearCookie('URIEL'); 
      res.redirect('http://localhost:3001/'); 
    });
  }
});

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`
      <p>Hola, ${req.user.displayName}</p>
      <form action="/logout" method="get">
        <button type="submit">Cerrar Sesión</button>
      </form>
    `);
  } else {
    res.redirect('/');
  }
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
