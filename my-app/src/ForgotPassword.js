import './styles.css';
import React, { useState } from 'react';

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tokenMessage, setTokenMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setMessage('Correo de recuperación enviado.');
        setShowTokenForm(true);
      } else {
        setMessage('Error al enviar el correo de recuperación.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al enviar el correo de recuperación.');
    }
  };

  const handleBackToLoginClick = () => {
    onBackToLogin();
  };

  const handleTokenValidation = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      if (response.ok) {
        setTokenMessage('Token válido. Por favor ingresa tu nueva contraseña.');
        setIsTokenValid(true);
      } else {
        setTokenMessage('Token inválido. Por favor verifica e intenta de nuevo.');
        setIsTokenValid(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setTokenMessage('Error al validar el token.');
      setIsTokenValid(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
  
    if (!token || !newPassword) {
      setTokenMessage('Por favor, completa todos los campos.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      });
  
      if (response.ok) {
        setTokenMessage('Contraseña cambiada exitosamente.');
        if (typeof onBackToLogin === 'function') {
          onBackToLogin();
        } else {
          console.warn('onBackToLogin no está definido o no es una función.');
        }
      } else {
        const errorData = await response.json();
        setTokenMessage(`Error al cambiar la contraseña: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setTokenMessage('Error al cambiar la contraseña. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="col-md-6 left active-section" id="forgotPasswordSection" style={{ backgroundColor: '#2C90A6' }}>
      <div className="form-container" style={{ backgroundColor: '#E8B880' }}>
        <h2>Recuperar Contraseña</h2>
        {!showTokenForm ? (
          <form onSubmit={handleForgotPassword} className="needs-validation" noValidate>
            <div className="form-group">
              <input
                type="email"
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
            <button type="submit" className="btn btn-primary rounded-pill" style={{ backgroundColor: '#E8B880' }}>Enviar Correo de Recuperación</button>
          </form>
        ) : (
          <>
            <form onSubmit={handleTokenValidation} className="needs-validation" noValidate>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Token de Recuperación"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
                <div className="invalid-feedback">
                  Por favor ingresa un token de recuperación válido.
                </div>
              </div>
              <button type="submit" className="btn btn-primary rounded-pill" style={{ backgroundColor: '#E8B880' }}>Validar Token</button>
              {tokenMessage && <p>{tokenMessage}</p>}
            </form>

            {isTokenValid && (
              <form onSubmit={handleChangePassword} className="needs-validation" noValidate>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nueva Contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">
                    Por favor ingresa una nueva contraseña.
                  </div>
                </div>
                <button type="submit" className="btn btn-primary rounded-pill" style={{ backgroundColor: '#E8B880' }}>Cambiar Contraseña</button>
              </form>
            )}
          </>
        )}
        {message && <p>{message}</p>}
        <button onClick={handleBackToLoginClick} className="btn btn-secondary rounded-pill" style={{ marginTop: '10px' }}>Volver a Iniciar Sesión</button>
      </div>
    </div>
  );
}

export default ForgotPassword;
