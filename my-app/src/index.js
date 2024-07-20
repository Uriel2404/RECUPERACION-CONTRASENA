import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [currentPage, setCurrentPage] = React.useState('login');

  const handleShowForgotPassword = () => {
    setCurrentPage('forgotPassword');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  let currentPageComponent = <Login onForgotPassword={handleShowForgotPassword} />;
  if (currentPage === 'forgotPassword') {
    currentPageComponent = <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }

  return (
    <React.StrictMode>
      <div className="container-fluid">
        <div className="row">
          {currentPageComponent}
          <Register />
        </div>
      </div>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
