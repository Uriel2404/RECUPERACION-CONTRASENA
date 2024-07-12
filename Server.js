const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const fetch = require('node-fetch');
const path = require('path');

// Configuración de Passport con la estrategia de Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: '759364434830-lei4kb0f52vj6v426146li535nm7bkpn.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  profile.accessToken = accessToken; // Guarda el token de acceso en el perfil del usuario
  return done(null, profile);
}));

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configuración de Express
const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  name: 'URIEL', // Nombre de la cookie de sesión
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos desde la carpeta build de la aplicación React
app.use(express.static(path.join(__dirname, 'build')));

// Ruta para autenticación con Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback para autenticación con Google
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Usuario autenticado:', req.user);
    res.redirect('/profile');
  }
);

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  // Revocar el token de acceso de Google si está presente
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
          return res.redirect('/'); // Maneja el error redirigiendo al inicio
        }
        res.clearCookie('URIEL'); // Limpiar la cookie de sesión
        res.redirect('http://localhost:3001/'); // Redirigir al inicio después de cerrar sesión
      });
    })
    .catch(err => {
      console.error('Error al revocar token de acceso de Google:', err);
      req.logout((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
          return res.redirect('/'); // Maneja el error redirigiendo al inicio
        }
        res.clearCookie('URIEL'); // Limpiar la cookie de sesión en caso de error
        res.redirect('http://localhost:3001/'); // Aunque falle la revocación, redirigir al inicio
      });
    });
  } else {
    req.logout((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.redirect('/'); // Maneja el error redirigiendo al inicio
      }
      res.clearCookie('URIEL'); // Limpiar la cookie de sesión
      res.redirect('http://localhost:3001/'); // Redirigir al inicio después de cerrar sesión
    });
  }
});

// Ruta para perfil del usuario autenticado
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`
      <p>Hola, ${req.user.displayName}</p>
      <form action="/logout" method="get">
        <button type="submit">Cerrar Sesión</button>
      </form>
      <form action="/auth/google" method="get">
        <button type="submit">Cambiar de Cuenta</button>
      </form>
    `);
  } else {
    res.redirect('/');
  }
});

// Ruta "catchall" para cualquier solicitud que no coincida con las anteriores, envía el archivo index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
