import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login';
import Register from './Register';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <React.StrictMode>
    <div className="container-fluid">
      <div className="row">
        <Login />
        <Register />
      </div>
    </div>
  </React.StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
