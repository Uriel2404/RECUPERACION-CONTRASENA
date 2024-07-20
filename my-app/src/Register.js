import './styles.css';
import React, { useEffect, useState } from 'react';
import { initializeScripts } from './Script';
import resizedImage from './resized_image.png';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    initializeScripts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        setMessage('Registro exitoso.');
      } else {
        setMessage('Error al registrar.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al registrar.');
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="col-md-6 right blurred" id="registerSection" style={{ backgroundColor: '#E8B880', color: 'black' }}>
      <div className="form-container" style={{ backgroundColor: '#2C90A6' }}>
        <img src={resizedImage} alt="Header Image" className="header-image" />
        <h2>REGISTRARSE</h2>
        <form id="registerForm" onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="form-group">
            <input type="email" id="registerEmail" className="form-control" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="invalid-feedback">
              Por favor ingresa un correo electrónico válido.
            </div>
          </div>
          <div className="form-group">
            <input type="password" id="registerPassword" className="form-control" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="invalid-feedback">
              La contraseña es requerida.
            </div>
          </div>
          <div className="form-group">
            <input type="password" id="confirmPassword" className="form-control" placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
