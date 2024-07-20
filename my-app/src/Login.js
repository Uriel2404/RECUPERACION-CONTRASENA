import './styles.css';
import React, { useState, useEffect } from 'react';
import { initializeScripts } from './Script';
import resizedImage from './resized_image.png';

function Login({ onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeScripts();
  }, []);

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleForgotPasswordClick = () => {
    onForgotPassword();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        setMessage('Inicio de sesión exitoso.');

      } else {
        const errorData = await response.text();
        setMessage('Correo electrónico o contraseña incorrectos.');
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al iniciar sesión.');
    }
  };  

  return (
    <div className="col-md-6 left active-section" id="loginSection" style={{ backgroundColor: '#2C90A6' }}>
      <div className="form-container" style={{ backgroundColor: '#E8B880' }}>
        <img src={resizedImage} alt="Header Image" className="header-image" />
        <h2>INICIAR SESIÓN</h2>
        <form id="loginForm" className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="loginEmail"
              className="form-control"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Por favor ingresa un correo electrónico válido.
            </div>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="loginPassword"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              La contraseña es requerida.
            </div>
          </div>
          <button type="submit" className="btn btn-dark rounded-pill" style={{ backgroundColor: '#2C90A6' }}>Enviar</button>
        </form>
        {message && <p>{message}</p>}
        <button onClick={handleGoogleSignIn} className="btn btn-danger rounded-pill" style={{ marginTop: '10px' }}>Iniciar sesión con Google</button>
        <p className="mt-3">¿Olvidaste tu contraseña?</p>
        <button onClick={handleForgotPasswordClick} className="btn btn-warning rounded-pill">Recuperar Contraseña</button>
      </div>
      <div className="bottom-text">
        <p>No tienes cuenta? Regístrate pulsando el botón</p>
        <a href="#register" id="registerBtn" className="switch-btn btn btn-outline-success rounded-pill" style={{ backgroundColor: '#fff', color: '#2C90A6' }}>Registrarse</a>
      </div>
    </div>
  );
}

export default Login;
