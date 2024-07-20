const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const fetch = require('node-fetch');
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

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
const PORT = process.env.PORT || 3000;

const tokenStore = {};
const userStore = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  name: 'URIEL',
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'build')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'urielruiz2424@gmail.com',
    pass: 'vkcb pmqw nzxi ibbt'
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (userStore[email]) {
    return res.status(400).send('El correo electrónico ya está registrado.');
  }
  userStore[email] = { password };
  console.log(`Usuario registrado: ${email}, Contraseña: ${password}`);
  res.status(200).send('Registro exitoso.');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`Iniciando sesión con: ${email}, Contraseña ingresada: ${password}`); // Debugging

  if (!userStore[email]) {
    return res.status(400).send('Correo electrónico no registrado.');
  }

  console.log(`Contraseña almacenada: ${userStore[email].password}`); // Debugging

  if (userStore[email] && userStore[email].password === password) {
    res.status(200).send('Inicio de sesión exitoso.');
  } else {
    return res.status(400).send('Contraseña incorrecta.');
  }
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!userStore[email]) {
    return res.status(400).send('Correo electrónico no registrado.');
  }
  const token = uuidv4(); 
  tokenStore[token] = email; 
  const mailOptions = {
    from: 'urielruiz2424@gmail.com',
    to: email,
    subject: 'Recuperación de Contraseña',
    text: `Tu token de recuperación es: ${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      return res.status(500).send('Error al enviar el correo.');
    }
    console.log('Correo de recuperación enviado:', info.response);
    res.status(200).send('Correo de recuperación enviado.');
  });
});

app.post('/validate-token', (req, res) => {
  const { token } = req.body;
  if (tokenStore[token]) {
    res.status(200).send('Token válido. Por favor ingresa tu nueva contraseña.');
  } else {
    res.status(400).send('Token inválido. Por favor verifica e intenta de nuevo.');
  }
});

app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const email = tokenStore[token];
    if (!email) {
      return res.status(400).send('Token inválido');
    }
    console.log(`Actualizando contraseña para: ${email}`); // Debugging
    userStore[email].password = newPassword;

    delete tokenStore[token];

    console.log('Contraseña cambiada exitosamente.'); // Mensaje de consola para depuración
    res.status(200).send('Contraseña cambiada exitosamente.');
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).send('Error al cambiar la contraseña.');
  }
});



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

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
