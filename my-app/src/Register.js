import './styles.css';
import React, { useEffect } from 'react';
import { initializeScripts } from './Script';
import resizedImage from './resized_image.png'; 

function Register() {
  useEffect(() => {
    initializeScripts();
  }, []);

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="col-md-6 right blurred" id="registerSection" style={{ backgroundColor: '#E8B880', color: 'black' }}>
      <div className="form-container" style={{ backgroundColor: '#2C90A6' }}>
        <img src={resizedImage} alt="Header Image" className="header-image" />
        <h2>REGISTRARSE</h2>
        <form id="registerForm" className="needs-validation" noValidate>
          <div className="form-group">
            <input type="email" id="registerEmail" className="form-control" placeholder="Correo Electrónico" required />
            <div className="invalid-feedback">
              Por favor ingresa un correo electrónico válido.
            </div>
          </div>
          <div className="form-group">
            <input type="password" id="registerPassword" className="form-control" placeholder="Contraseña" required />
            <div className="invalid-feedback">
              La contraseña es requerida.
            </div>
          </div>
          <div className="form-group">
            <input type="password" id="confirmPassword" className="form-control" placeholder="Confirmar Contraseña" required />
            <div className="invalid-feedback">
              Por favor confirma tu contraseña.
            </div>
          </div>
          <button type="submit" className="btn btn-primary rounded-pill" style={{ backgroundColor: '#E8B880' }}>Enviar</button>
        </form>
        <button onClick={handleGoogleSignIn} className="btn btn-danger rounded-pill" style={{ marginTop: '10px' }}>Registrarse con Google</button>
      </div>
      <div className="bottom-text">
        <p>Ya tienes cuenta? Inicia sesión pulsando el botón</p>
        <a href="#login" id="loginBtn" className="switch-btn btn btn-outline-danger rounded-pill" style={{ backgroundColor: '#fff', color: '#E8B880' }}>Iniciar Sesión</a>
      </div>
    </div>
  );
}

export default Register;
