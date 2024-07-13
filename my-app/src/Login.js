import './styles.css';
import React, { useEffect } from 'react';
import { initializeScripts } from './Script';
import resizedImage from './resized_image.png'; 

function Login() {
  useEffect(() => {
    initializeScripts();
  }, []);

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="col-md-6 left active-section" id="loginSection" style={{ backgroundColor: '#2C90A6' }}>
      <div className="form-container" style={{ backgroundColor: '#E8B880' }}>
        <img src={resizedImage} alt="Header Image" className="header-image" />
        <h2>INICIAR SESIÓN</h2>
        <form id="loginForm" className="needs-validation" noValidate>
          <div className="form-group">
            <input type="email" id="loginEmail" className="form-control" placeholder="Correo Electrónico" required />
            <div className="invalid-feedback">
              Por favor ingresa un correo electrónico válido.
            </div>
          </div>
          <div className="form-group">
            <input type="password" id="loginPassword" className="form-control" placeholder="Contraseña" required />
            <div className="invalid-feedback">
              La contraseña es requerida.
            </div>
          </div>
          <button type="submit" className="btn btn-dark rounded-pill" style={{ backgroundColor: '#2C90A6' }}>Enviar</button>
        </form>
        <button onClick={handleGoogleSignIn} className="btn btn-danger rounded-pill" style={{ marginTop: '10px' }}>Iniciar sesión con Google</button>
      </div>
      <div className="bottom-text">
        <p>No tienes cuenta? Regístrate pulsando el botón</p>
        <a href="#register" id="registerBtn" className="switch-btn btn btn-outline-success rounded-pill" style={{ backgroundColor: '#fff', color: '#2C90A6' }}>Registrarse</a>
      </div>
    </div>
  );
}

export default Login;
